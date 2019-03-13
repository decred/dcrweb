#!/usr/bin/env bash

# convert localization files from Transifex format to Hugo i18n

for i in transifex_catalogs/*.json; do

    f=$(basename $i)
    outfile=src/i18n/$f

    jq 'to_entries | map({ id: .key, translation: .value})' $i > $outfile

done

