#!/usr/bin/env bash

# validate generated html content

CONTENT_DIR=/usr/share/nginx/html

if [ "$1" != "" ]; then
    CONTENT_DIR=$1
fi

echo
echo "Validating pages "

FILES=$(find $CONTENT_DIR -name \*.html | grep -v google)
PATH=node_modules/.bin:$PATH

exit_code=0
error_files=""

for file in $FILES; do
    echo -n .
    html-validator \
        --quiet \
        --errors-only \
        --validator='http://validator:8888' \
        --file=$file && continue
    error_files="$error_files $file"
    exit_code=1
done

echo
echo "Validation completed"

if [ $exit_code != "0" ]; then
    echo "Errors found:"
    echo $error_files | sed "s|$CONTENT_DIR/|\t|g" | sed 's/ /\n/g'
else
    echo "No errors found."
fi

exit $exit_code
