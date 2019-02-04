#!/usr/bin/env bash

# validate generated html content

echo -n "Starting nu validator "

docker run -d --rm --name nu_validator -p 8888:8888 validator/validator:latest || exit 1

# wait for the service to start up

while true; do
    curl -qqq localhost:8888 2>/dev/null >/dev/null && break
    echo -n .
    sleep 1;
done

echo
echo -n "Validating pages "

FILES=$(find src/public -name \*.html | grep -v google)
PATH=node_modules/.bin:$PATH

exit_code=0
error_files=""

for file in $FILES; do
    echo -n .
    html-validator --quiet --errors-only --validator='http://localhost:8888' --file=$file && continue
    error_files="$error_files $file"
    exit_code=1
done

echo done

if [ $exit_code != "0" ]; then
    echo "errors found: $error_files"
else
    echo "no errors found"
fi

docker stop nu_validator >/dev/null

exit $exit_code