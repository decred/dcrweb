#!/usr/bin/env bash

bin/i18n-convert-transifex-hugo.sh

mkdir -p src/public src/resources

hugo -s src

