# Build image
FROM alpine:latest

ARG HUGO_BASEURL
ENV HUGO_BASEURL="${HUGO_BASEURL:-https://decred.org/}"
ENV HUGO_VERSION="0.152.2"

LABEL description="gohugo build"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

WORKDIR /tmp

RUN apk update && apk upgrade
RUN apk add --no-cache bash jq wget libc6-compat g++
RUN wget -q https://github.com/gohugoio/hugo/releases/download/v$HUGO_VERSION/hugo_extended_"$HUGO_VERSION"_linux-amd64.tar.gz
RUN tar xz -C /usr/local/bin -f hugo_extended_"$HUGO_VERSION"_linux-amd64.tar.gz

WORKDIR /root

COPY ./ /root/

RUN bin/build-hugo.sh

# Serve image (stable nginx version)
# This cannot use Alpine because test/Dockerfile builds on this image and
# expects it to have apt-get.
FROM nginx:1.28

LABEL description="dcrweb server"
LABEL version="1.0"
LABEL maintainer="peter@froggle.org"

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

# /usr/share/nginx/html is also hardcoded in test/run-test.sh
COPY --from=0 /root/src/public/ /usr/share/nginx/html
