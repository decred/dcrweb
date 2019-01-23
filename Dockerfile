# builder image
FROM golang

ARG HUGO_BASEURL
ENV HUGO_BASEURL ${HUGO_BASEURL:-https://decred.org}

LABEL description="gohugo build"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

WORKDIR /tmp

RUN wget https://github.com/gohugoio/hugo/releases/download/v0.53/hugo_extended_0.53_Linux-64bit.tar.gz
RUN tar xz -C /usr/local/bin -f  hugo_extended_0.53_Linux-64bit.tar.gz

WORKDIR /root

COPY src/ /root/

RUN hugo


# final image
FROM nginx

LABEL description="dcrweb server"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /root/public/ /usr/share/nginx/html
