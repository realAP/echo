FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

RUN chmod 755 /usr/share/nginx/html/index.html
RUN chmod 755 /usr/share/nginx/html/script.js
RUN chmod 755 /usr/share/nginx/html/styles.css