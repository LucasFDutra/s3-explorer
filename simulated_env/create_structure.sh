aws --endpoint-url=http://localhost:4566 s3 mb s3://mybucket-1
aws --endpoint-url=http://localhost:4566 s3 mb s3://mybucket-2
aws --endpoint-url=http://localhost:4566 s3 cp conteudo-1 s3://mybucket-1/ --recursive