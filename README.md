# decred-staging — decred site

This is one of three independent Hugo projects under `decred-staging/`. It is
the source for the staging build of the Decred main site (home, wallets,
exchanges, governance).

It is built with [Hugo](https://gohugo.io/) (extended, v0.152.2) and uses
[Docker](https://www.docker.com/) for deployment, mirroring the `dcrweb-master`
template.

## Development

Start a local development web server at <http://localhost:1313>:

```sh
./bin/watch.sh
```

The `watch.sh` script will:

1. Convert `transifex_catalogs/*.json` → `src/i18n/*.json`.
2. Clone `src/content/en` into `src/content/<lang>` for each non-English
   language declared in `src/config.yml`.
3. Run `hugo server` against `src/`.

## Deployment with Docker

```sh
# Build the image.
./bin/build.sh

# Start the container.
docker run -d -p <local port>:80 decred/decred-web:latest
```

## Editing content

Translation strings are defined in `transifex_catalogs/<lang>.json`
(flat `key: value` pairs). The English file is the source of truth; other
languages should mirror its keys.

Page templates live in `src/layouts/`. Common chrome (head, header, footer,
language switcher) is in `src/layouts/_default/baseof.html` and
`src/layouts/partials/`.

## Localization

Supported languages are configured in `src/config.yml` under the `languages`
key. To add a new language:

1. Add an entry to `src/config.yml`.
2. Drop a `<lang>.json` translation file into `transifex_catalogs/`.
3. Re-run `./bin/watch.sh`.
