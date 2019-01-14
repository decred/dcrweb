#!/usr/bin/env bash

rm -rf  src/resources/

hugo server -D --disableFastRender -s src
