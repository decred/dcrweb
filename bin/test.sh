#!/usr/bin/env bash

# validate generated html content
bin/build.sh

# build image that contains the content 
docker build -t decred/dcrweb-test test

echo -n "Starting nu validator "

# run nu-validator service
docker stop validator 2>/dev/null

docker run \
    -d --rm \
    --name validator \
    -p 8888:8888 ghcr.io/validator/validator:21.7.10 || exit 1

# wait for the validator service to start up

while true; do
    curl -qqq localhost:8888 2>/dev/null >/dev/null && break
    echo -n .
    sleep 1;
done

echo

docker run --rm --link validator decred/dcrweb-test

exit_code=$?

echo -n "Stopping validator..."
docker stop validator 2>/dev/null
echo

exit $exit_code
