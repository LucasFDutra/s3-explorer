FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/s3-explorer.conf /etc/nginx/conf.d/s3-explorer.conf
COPY nginx/s3-explorer-api.conf /etc/nginx/conf.d/s3-explorer-api.conf
COPY frontend/build /usr/share/nginx/html

RUN apt update && apt upgrade -y
RUN apt install python3 -y
RUN apt install python3-pip -y

WORKDIR /app
COPY start-service.sh .
COPY backend ./backend
RUN pip3 install -r ./backend/requirements.txt
RUN chmod +x start-service.sh

EXPOSE 80
EXPOSE 5000

CMD ["./start-service.sh"]