#DOCKER_IMAGE_TAG=decred/dcrweb
FROM php:7.1-apache

LABEL description="dcrweb-www"
LABEL version="1.0"
LABEL maintainer "peter@froggle.org"

RUN a2enmod rewrite

COPY dockerfiles/api/php.ini /usr/local/etc/php/
COPY dockerfiles/www/apache2.conf /etc/apache2

# install apcu extension
RUN pecl install apcu && \
    docker-php-ext-enable apcu

# copy document root
COPY build/ /var/www/html/
COPY api/ /var/www/html/api/
