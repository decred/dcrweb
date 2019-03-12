#!/usr/bin/env bash

bin/i18n-convert-transifex-hugo.sh

hugo --gc -s src

hugo server -D --disableFastRender -s src -b http://localhost:1313
