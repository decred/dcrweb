#!/usr/bin/env bash

tx pull -a $*

for i in transifex_catalogs/*.json; do

    f=$(basename $i)
    outfile=src/i18n/$f

    jq 'to_entries | map({ id: .key, translation: .value})' $i > $outfile

done




