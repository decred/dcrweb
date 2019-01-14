#!/usr/bin/env bash


tx config mapping-bulk -p dcrweb-hugo --source-language en --type GITHUBMARKDOWN  -f '.md' --source-file-dir src/content --expression 'src/content/<lang>/{filepath}/{filename}' --execute

echo "Collected all source markdown files.  If you want to push the files to the Transifex workspace, run"
echo "tx push -s"

