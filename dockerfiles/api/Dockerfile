FROM php:7.1-apache

LABEL description="dcrweb-api"
LABEL version="1.0"
LABEL maintainer "peter@froggle.org"

COPY dockerfiles/api/php.ini /usr/local/etc/php/

# install apcu extension
RUN pecl install apcu && \
    docker-php-ext-enable apcu

# copy document root
COPY api/ /var/www/html/
