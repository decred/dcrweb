#!/usr/bin/env bash

set -e

bin/i18n-convert-transifex-hugo.sh

# Remove old hugo output before building
rm -rf src/public src/resources

HUGO=hugo
if [[ ! $(type -P  ${HUGO}) ]]; then
    HUGO="go run -v -tags extended github.com/gohugoio/hugo@v0.152.2"
fi

${HUGO} version

# Serve site
#   --buildFuture          include content with publishdate in the future
#   --buildDrafts          include content marked as draft
#   --disableFastRender    enables full re-renders on changes
#   --source               filesystem path to read files relative from
#   --baseURL              hostname (and path) to the root
${HUGO} server \
    --buildFuture \
    --buildDrafts \
    --disableFastRender \
    --source src \
    --baseURL http://localhost:1313/
