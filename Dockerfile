#DOCKER_IMAGE_TAG=decred/dcrweb
FROM httpd:alpine

LABEL description="dcrweb"
LABEL version="1.0"
LABEL maintainer "peter@froggle.org"

# copy document root
COPY build/ /var/www/html/

COPY runtime/httpd.conf /usr/local/apache2/conf
COPY runtime/httpd-foreground  /usr/local/bin/
