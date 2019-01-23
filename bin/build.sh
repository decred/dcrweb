#!/usr/bin/env bash

IMAGE_NAME=decred/dcrweb

if [ "$1" != "" ]; then
    IMAGE_NAME=$1
fi

docker build --build-arg HUGO_BASEURL=$HUGO_BASEURL -t $IMAGE_NAME  .


