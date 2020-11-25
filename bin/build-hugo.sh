#!/usr/bin/env bash

set -ex

bin/i18n-convert-transifex-hugo.sh

# Remove old hugo output before building
rm -rf src/public src/resources

mkdir -p src/public src/resources

hugo -F -s src
