FROM nginx

MAINTAINER debu

VOLUME /home/ubuntu/Project/development/janus-angular-web-app/dist/light:/var/www/html
VOLUME /home/ubuntu/Project/development/janus-angular-web-app/dist/light:/usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 
