#!/usr/bin/env bash

bin/i18n-convert-transifex-hugo.sh

hugo --gc -s src

hugo server -F -D --disableFastRender -s src -b http://localhost:1313
