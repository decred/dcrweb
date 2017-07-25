#DOCKER_IMAGE_TAG=decred/dcrweb
FROM httpd:alpine

LABEL description="dcrweb"
LABEL version="1.0"
LABEL maintainer "peter@froggle.org"

COPY httpd.conf /usr/local/apache2/conf

# copy document root
COPY build/ /var/www/html/
