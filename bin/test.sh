#!/usr/bin/env bash

# validate generated html content
bin/build.sh

# build image that contains the content 
docker build -t decred/dcrweb-test test

echo -n "Starting nu validator "

# run nu-validator service
docker stop validator 2>/dev/null

# validator image pulled by the digest (immutable id) to avoid supply-chain attacks.
# validator no longer does numbered releases, this is the latest as of November 2025.
validator_version="sha256:bced7e1a07762be88a6514302c68c37dae98c60f62deb48db7b0a2ab91bb9041"

docker run \
    -d --rm \
    --name validator \
    -p 8888:8888 \
    ghcr.io/validator/validator@$validator_version \
    || exit 1

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
