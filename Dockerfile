# Build image
FROM node:10.14.1

LABEL description="dcrweb build"
LABEL version="1.0"
LABEL maintainer "holdstockjamie@gmail.com"

USER root
WORKDIR /root

COPY ./ /root

RUN yarn global add grunt

RUN yarn install && \
    yarn run deploy:build 

# Final image
FROM httpd:2.4

LABEL description="dcrweb serve"
LABEL version="1.0"
LABEL maintainer "holdstockjamie@gmail.com"

COPY --from=0 /root/docker-build/ /usr/local/apache2/htdocs/

COPY runtime/httpd.conf        /usr/local/apache2/conf
COPY runtime/httpd-foreground  /usr/local/bin/
