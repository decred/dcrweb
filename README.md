# dcrweb
[![Build Status](https://github.com/decred/dcrweb/actions/workflows/build.yml/badge.svg)](https://github.com/decred/dcrweb/actions/workflows/build.yml)
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
| Media Coverage     | `src/data/news/coverage.yml` |
| Decred Journals    | `src/data/news/decred_journals.yml` |
| Software releases  | `src/data/news/software_releases.yml` |
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

Internationalization (i18n) files for translating dcrweb into languages other
than English are in the [transifex_catalogs](./transifex_catalogs/)
directory.
A README in that directory explains how translation strings should be updated.

## License

dcrweb is licensed under the liberal ISC License.
