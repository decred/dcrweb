#!/usr/bin/env bash

IMAGE_NAME=decred/dcrweb

if [ "$1" != "" ]; then
    IMAGE_NAME=$1
fi

docker build -t $IMAGE_NAME  .


