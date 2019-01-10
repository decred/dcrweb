#!/usr/bin/env bash


jq 'map( { (.id): .translation } ) | add'  src/i18n/en.json > transifex_catalogs/en.json

tx push -s
