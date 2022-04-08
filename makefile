build:
	cd frontend
	npm run build
	cd ..
	docker build -t lucasfdutra/s3-explorer .

deploy:
	docker image push lucasfdutra/s3-explorer:latest