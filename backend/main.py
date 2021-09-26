import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import pandas as pd

# from dotenv import load_dotenv
# load_dotenv()

endpoint_url = os.getenv('ENDPOINT_URL', False)
client_config = {
    'service_name': 's3',
    'aws_access_key_id': os.getenv('AWS_ACCESS_KEY_ID'),
    'aws_secret_access_key': os.getenv('AWS_SECRET_ACCESS_KEY')
}
if endpoint_url:
    client_config['endpoint_url'] = endpoint_url

app = Flask(__name__)
CORS(app)

@app.route('/get_buckets', methods=['GET'])
def get_buckets():
    s3_client = boto3.client(**client_config)
    response = s3_client.list_buckets()
    buckets = [bucket.get('Name') for bucket in response.get('Buckets', [])]
    del s3_client
    return jsonify(buckets)

@app.route('/get_object_list', methods=['GET'])
def get_object_list():
    bucket = request.headers.get('x-bucket', False)
    prefix = request.headers.get('x-prefix', '')

    if (prefix != '' and prefix[-1] != '/'):
        return 'Prefixo inválido', 400
    if not bucket:
        return 'Bucket inválido', 400

    df_keys = pd.DataFrame()
    
    s3_client = boto3.client(**client_config)
    response = s3_client.list_objects_v2(Bucket=bucket, Prefix=prefix)
    if response.get('KeyCount') == 0:
        return jsonify([])

    keys = response.get('Contents', [])
    df_keys = df_keys.append(
        pd.DataFrame(keys).loc[:, [
            'Key', 'LastModified', 'Size'
        ]].rename(columns={
            'Key': 'key', 'LastModified': 'last_modified', 'Size': 'size'
        })
    , ignore_index=True)

    while response.get('NextContinuationToken'):
        response = s3_client.list_objects_v2(
            Bucket=bucket, 
            Prefix=prefix, 
            ContinuationToken=response.get('NextContinuationToken')
        )

        keys = response.get('Contents', [])
        df_keys = df_keys.append(
            pd.DataFrame(keys).loc[:, [
                'Key', 'LastModified', 'Size'
            ]].rename(columns={
                'Key': 'key', 'LastModified': 'last_modified', 'Size': 'size'
            })
        , ignore_index=True)
    
    del s3_client
    df_keys.loc[:, 'tmp_key'] = df_keys.loc[:, 'key'].str.replace(prefix, '').str.split('/')
    df_keys.loc[:, 'name'] = df_keys.loc[:, 'tmp_key'].str[0]
    df_keys.loc[:, 'is_folder'] = df_keys.loc[:, 'tmp_key'].str.len() > 1
    df_keys.loc[:, 'last_modified'] = df_keys.loc[:, 'last_modified'].dt.tz_localize(None)
    df_keys.loc[df_keys.loc[:, 'is_folder'], 'key'] = ''

    df_keys = df_keys.loc[:, [
        'name', 'is_folder', 'last_modified', 'size', 'key'
    ]].groupby(by=['name', 'is_folder', 'key']).agg({
        'last_modified': 'max',
        'size': 'sum'
    }).reset_index(drop=False).sort_values(by=[
        'is_folder', 'name', 'last_modified'
    ], ascending=[False, True, True]).reset_index(drop=True)

    df_keys.loc[:, 'last_modified'] = df_keys.loc[:, 'last_modified'].astype('str')

    return jsonify(df_keys.to_dict('records'))

@app.route('/download_object', methods=['GET'])
def download_object():
    bucket = request.headers.get('x-bucket', False)
    key_name = request.headers.get('x-key-name', '')
    
    s3_client = boto3.client(**client_config)
    url = s3_client.generate_presigned_url(
        ClientMethod='get_object', 
        Params={'Bucket': bucket, 'Key': key_name, 'ResponseContentType': 'application/octet-stream'},
        ExpiresIn=2,
        HttpMethod='GET'
    )
    del s3_client
    return url

if __name__ == '__main__':
    os.environ['FLASK_ENV'] = 'development'
    app.run(host='0.0.0.0', port=5000)