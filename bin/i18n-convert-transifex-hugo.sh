#!/usr/bin/env bash

set -e

for i in transifex_catalogs/*.json; do

    lang=$(basename $i .json)
    outfile=src/i18n/$lang.json

    echo "Writing i18n files for $lang"

    # Convert localization files from Transifex format to Hugo i18n.
    jq 'to_entries | map({ id: .key, translation: .value})' $i > $outfile

    # Create content sub-directory for this lang.
    if [ $lang = "en" ]; then
        continue
    fi
    rm -rf src/content/$lang
    cp -r src/content/en src/content/$lang
done

