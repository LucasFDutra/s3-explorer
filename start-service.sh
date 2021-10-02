if [ "$BACKEND_API_URL" != "" ];
then
    echo "var API_URL = '$BACKEND_API_URL'" >> /usr/share/nginx/html/config.js
else
    echo "var API_URL = 'http://0.0.0.0:5000'" >> /usr/share/nginx/html/config.js
fi

sh -c "nohup uwsgi /app/backend/app.ini &" && sh -c "nginx -g 'daemon off;'"