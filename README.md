# dcrweb

[![Build Status](https://travis-ci.org/decred/dcrweb.png?branch=master)](https://travis-ci.org/decred/dcrweb)
[![ISC License](http://img.shields.io/badge/license-ISC-blue.svg)](http://copyfree.org)

## Overview

This is the code for the [decred.org](https://decred.org) website.
It is built using the static site generator [Hugo](https://gohugo.io/) and
utilizes [Docker](https://www.docker.com/) for testing and deployment.

## Development

To start a development web server at <http://localhost:1313>:

```sh
./bin/watch.sh
```

Run the HTML validator to ensure all of the generated files are syntactically
correct:

```sh
./bin/test.sh
```

## Deployment with Docker

```sh
# Build the decred/dcrweb image.
./bin/build.sh

# Start the container.
docker run -d -p <local port>:80 decred/dcrweb:latest
```

## Editing content

The most frequently updated content sections live in the below locations:

| Section            | File |
| ------------------ | ---- |
| News               | `src/data/news/news.yml` |
| Press releases     | `src/content/news/*.md` |
| Wallets            | `src/data/wallets/wallets.yml` |
| Community channels | `src/data/community/channels.yml` |
| Support channels   | `src/data/community/support.yml` |
| Publications       | `src/data/community/publications.yml` |
| Exchanges          | `src/data/exchanges/*.yml` |

The other sections live under `src/layouts`.
These pages are implemented as [Hugo templates](https://gohugo.io/templates/)
and are
[localized](https://gohugo.io/content-management/multilingual/#translation-of-strings).
The message catalogs can be found in `src/i18n`.
When making changes in the templates, you'll want to keep the strings in the
catalogs, please follow the naming scheme in the existing templates.

## Localization

The below commands must be run when either the content changes or there are
updates in the translations in Transifex.
You'll first need to install the [Transifex client](https://docs.transifex.com/client/installing-the-client).

#### Importing new translations and content updates

When translations are added/updated in [Transifex](https://www.transifex.com/decred/public/),
pull the updates:

```sh
./bin/transifex_pull.sh
```

When you run this for the first time, you'll be asked to log in with your
Transifex username/password.

To push the changes to staging:

```sh
git commit -m "Translation update"
git push origin
```

#### Updating the message catalog

When the master content changes in the HTML files, you'll need to regenerate
the message catalog and push it to Transifex so that translators can update the
localized message catalogs:

```sh
./bin/transifex_push.sh
```

## License

dcrweb is licensed under the liberal ISC License.
