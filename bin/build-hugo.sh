#!/usr/bin/env bash

set -ex

bin/i18n-convert-transifex-hugo.sh

mkdir -p src/public src/resources

hugo -F -s src
