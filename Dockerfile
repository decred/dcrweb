# builder image
FROM golang

ARG HUGO_BASEURL
ENV HUGO_BASEURL ${HUGO_BASEURL:-https://decred.org}
ENV HUGO_VERSION 0.54.0

LABEL description="gohugo build"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

WORKDIR /tmp

RUN wget -q https://github.com/gohugoio/hugo/releases/download/v$HUGO_VERSION/hugo_extended_"$HUGO_VERSION"_Linux-64bit.tar.gz
RUN tar xz -C /usr/local/bin -f  hugo_extended_"$HUGO_VERSION"_Linux-64bit.tar.gz

WORKDIR /root

COPY src/ /root/

RUN hugo

# final image
FROM nginx:1.14.2

LABEL description="dcrweb server"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /root/public/ /usr/share/nginx/html
