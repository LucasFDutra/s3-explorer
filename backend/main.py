import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.client import Config
import pandas as pd
import re

buckets_to_not_show = os.getenv('BUCKETS_TO_NOT_SHOW', '')
buckets_to_show = os.getenv('BUCKETS_TO_SHOW', False)
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

@app.route('/api/get_buckets', methods=['GET'])
def get_buckets():
    try:
        s3_client = boto3.client(**client_config)
        response = s3_client.list_buckets()
        if buckets_to_show:
            buckets = [bucket.get('Name') for bucket in response.get('Buckets', []) if bucket.get('Name') in buckets_to_show.split(',')]
        else:
            buckets = [bucket.get('Name') for bucket in response.get('Buckets', []) if bucket.get('Name') not in buckets_to_not_show.split(',')]
        del s3_client
        return jsonify(buckets)
    except Exception as e:
        print(e)
        return 'Oops! ocorreu um erro inesperado', 500

@app.route('/api/get_object_list', methods=['GET'])
def get_object_list():
    try:
        bucket = request.headers.get('x-bucket', False)
        prefix = request.headers.get('x-prefix', '')
        next_continuation_token = request.headers.get('x-next-continuation-token', False)

        if (prefix != '' and prefix[-1] != '/'):
            return 'Prefixo inválido', 400
        if not bucket:
            return 'Bucket inválido', 400

        df_keys = pd.DataFrame()
        folders_list = []
        
        list_objects_config = {
            'Bucket': bucket,
            'Prefix': prefix,
            'Delimiter': '/'
        }
        
        s3_client = boto3.client(**client_config)
        if next_continuation_token:
            list_objects_config['ContinuationToken'] = next_continuation_token
        else:
            paginator = s3_client.get_paginator('list_objects_v2')
            result = paginator.paginate(Bucket=bucket, Prefix=prefix, Delimiter='/')
            for folder in result.search('CommonPrefixes'):
                if folder:
                    folder_without_prefix = re.sub(f'^{prefix}', '', folder.get('Prefix'))
                    folders_list.append({'name': folder_without_prefix.split('/')[0], 'is_folder': True})

        response = s3_client.list_objects_v2(**list_objects_config)
        keys = response.get('Contents', [])
        
        if len(keys) == 0:
            response_dict = {'next_continuation_token': False}
            response_dict['objects'] = folders_list
            return jsonify(response_dict)

        df_keys = df_keys.append(
            pd.DataFrame(keys).loc[:, [
                'Key', 'LastModified', 'Size'
            ]].rename(columns={
                'Key': 'key', 'LastModified': 'last_modified', 'Size': 'size'
            })
        , ignore_index=True)

        next_continuation_token = response.get('NextContinuationToken', False)
        
        df_keys.loc[:, 'tmp_key'] = df_keys.loc[:, 'key'].str.replace(f'^{prefix}', '', regex=True).str.split('/')
        df_keys.loc[:, 'name'] = df_keys.loc[:, 'tmp_key'].str[0]
        df_keys.loc[:, 'last_modified'] = df_keys.loc[:, 'last_modified'].dt.tz_localize(None)
        df_keys.loc[:, 'is_folder'] = False
        if len(folders_list) > 0:
            df_keys = df_keys.append(pd.DataFrame(folders_list), ignore_index=True)
        df_keys.loc[:, 'name_lower'] = df_keys.loc[:, 'name'].str.lower()
        df_keys = df_keys.sort_values(by=[
            'is_folder', 'name_lower', 'last_modified'
        ], ascending=[False, True, True]).reset_index(drop=True)

        df_keys = df_keys.loc[:, [
            'is_folder', 'name', 'last_modified', 'size', 'key'
        ]]
        df_keys.fillna('', inplace=True)
        df_keys.loc[:, 'last_modified'] = df_keys.loc[:, 'last_modified'].astype('str')
        df_keys.loc[df_keys.loc[:, 'last_modified'] == 'NaT', 'last_modified'] = ''

        response_dict = {'next_continuation_token': next_continuation_token}
        response_dict['objects'] = df_keys.to_dict('records')
        del s3_client
        del df_keys

        return jsonify(response_dict)
    except Exception as e:
        print(e)
        return 'Oops! ocorreu um erro inesperado', 500

@app.route('/api/download_object', methods=['GET'])
def download_object():
    try:
        bucket = request.headers.get('x-bucket', False)
        key_name = request.headers.get('x-key-name', '')

        if not key_name:
            return 'Caminho do arquivo inválido', 400
        if not bucket:
            return 'Bucket inválido', 400

        try:
            s3_client = boto3.client(**client_config)
            response = s3_client.get_bucket_location(
                Bucket=bucket
            )
            location = response.get('LocationConstraint')
            del s3_client
        except Exception as e:
            print(e)
            return 'Esse bucket não existe', 400
        
        s3_client = boto3.client(**client_config, config=Config(signature_version='s3v4', region_name=location))
        url = s3_client.generate_presigned_url(
            ClientMethod='get_object', 
            Params={'Bucket': bucket, 'Key': key_name, 'ResponseContentType': 'application/octet-stream'},
            ExpiresIn=2,
            HttpMethod='GET'
        )
        del s3_client
        return url
    except Exception as e:
        print(e)
        return 'Oops! ocorreu um erro inesperado', 500

@app.route('/api/search_object', methods=['GET'])
def search_object():
    try:
        bucket = request.headers.get('x-bucket', False)
        prefix = request.headers.get('x-prefix', '')
        search_term = request.headers.get('x-search-term', '')
        next_continuation_token = request.headers.get('x-next-continuation-token', False)

        if (search_term == ''):
            return 'Termo de busca inválido', 400
        if not bucket:
            return 'Bucket inválido', 400

        df_keys = pd.DataFrame()
        
        list_objects_config = {
            'Bucket': bucket,
            'Prefix': prefix
        }
        while True:
            if next_continuation_token:
                list_objects_config['ContinuationToken'] = next_continuation_token

            s3_client = boto3.client(**client_config)
            response = s3_client.list_objects_v2(**list_objects_config)
            keys = response.get('Contents', [])
            
            if len(keys) == 0:
                response_dict = {'next_continuation_token': False}
                response_dict['objects'] = []
                return jsonify(response_dict)

            df_keys = df_keys.append(
                pd.DataFrame(keys).loc[:, [
                    'Key', 'LastModified', 'Size'
                ]].rename(columns={
                    'Key': 'key', 'LastModified': 'last_modified', 'Size': 'size'
                })
            , ignore_index=True)

            df_keys.loc[:, 'tmp_key'] = df_keys.loc[:, 'key'].str.replace(f'^{prefix}', '', regex=True)
            df_keys.loc[:, 'tmp_key'] = df_keys.loc[:, 'tmp_key'] + df_keys.loc[:, 'last_modified'].dt.tz_localize(None).astype('str')
            df_keys = df_keys.loc[df_keys.loc[:, 'tmp_key'].str.lower().str.contains(search_term.lower()), :].reset_index(drop=True)

            next_continuation_token = response.get('NextContinuationToken', False)
            if df_keys.shape[0] >= 50 or not next_continuation_token:
                break
        
        df_keys.loc[:, 'name'] = df_keys.loc[:, 'key'].str.split('/').str[-1]
        df_keys.loc[:, 'last_modified'] = df_keys.loc[:, 'last_modified'].dt.tz_localize(None)
        df_keys.loc[:, 'name_lower'] = df_keys.loc[:, 'name'].str.lower()
        df_keys = df_keys.sort_values(by=[
            'name_lower', 'last_modified'
        ], ascending=[True, True]).reset_index(drop=True)

        df_keys = df_keys.loc[:, [
            'name', 'last_modified', 'size', 'key'
        ]]
        df_keys.fillna('', inplace=True)
        df_keys.loc[:, 'last_modified'] = df_keys.loc[:, 'last_modified'].astype('str')
        df_keys.loc[df_keys.loc[:, 'last_modified'] == 'NaT', 'last_modified'] = ''

        response_dict = {'next_continuation_token': next_continuation_token}
        response_dict['objects'] = df_keys.to_dict('records')
        del s3_client
        del df_keys

        return jsonify(response_dict)
    except Exception as e:
        print(e)
        return 'Oops! ocorreu um erro inesperado', 500

if __name__ == '__main__':
    from dotenv import load_dotenv
    load_dotenv()

    os.environ['FLASK_ENV'] = 'development'
    app.run(host='0.0.0.0', port=5000)
