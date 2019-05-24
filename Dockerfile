# builder image
FROM golang

ARG HUGO_BASEURL
ENV HUGO_BASEURL ${HUGO_BASEURL:-https://decred.org}
ENV HUGO_VERSION 0.55.6

LABEL description="gohugo build"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

WORKDIR /tmp

RUN apt-get update && apt-get -y install jq
RUN wget -q https://github.com/gohugoio/hugo/releases/download/v$HUGO_VERSION/hugo_extended_"$HUGO_VERSION"_Linux-64bit.tar.gz
RUN tar xz -C /usr/local/bin -f  hugo_extended_"$HUGO_VERSION"_Linux-64bit.tar.gz

WORKDIR /root

COPY ./ /root/

RUN bin/build-hugo.sh

# final image
FROM nginx:1.16.0

LABEL description="dcrweb server"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /root/src/public/ /usr/share/nginx/html
