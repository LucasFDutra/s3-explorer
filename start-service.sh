sh -c "nohup uwsgi /app/backend/app.ini &" && sh -c "nginx -g 'daemon off;'"