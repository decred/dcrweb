#!/usr/bin/env bash

hugo --gc -s src

hugo server -D --disableFastRender -s src -b http://localhost:1313
