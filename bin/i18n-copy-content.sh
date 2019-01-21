#!/usr/bin/env bash

LANGUAGES="zh ko ja pt ru tr fa ar es de pl"


FILES=$(find src/content -name _index.md)

for FILE in $FILES; do
    dir=$(dirname $FILE)
    for LANG in $LANGUAGES; do
        basename=$(basename $FILE .md)
        newfile="$basename.$LANG.md"
        cp $FILE $dir/$newfile
    done
done


