dcrweb
======

This is the code for the [decred.org](https://www.decred.org) website.

[![CircleCI](https://circleci.com/gh/peterzen/dcrweb.svg?style=svg)](https://circleci.com/gh/peterzen/dcrweb)

## Localization

The below commands must be run when either the content changes or there are updates in the translations in Transifex.  You'll first need to install the [Transifex client](https://docs.transifex.com/client/installing-the-client).

#### Downloading web site code

Make sure you have [git](https://git-scm.com/) installed.

```sh
git clone https://github.com/decred/dcrweb
cd dcrweb; git checkout localization
```

#### Importing new translations and content updates

When translations are added/updated in [Transifex](https://www.transifex.com/decred/), pull the updates:

```sh
npm run transifex:pull
```

When you run this for the first time, you'll be asked to log in with your Transifex username/password.

To push the changes to staging:

```sh
git commit -m'Translation update'
git push origin
```

This triggers the update on the staging site, which will be rebuilt usually in a few minutes (give it 5):

[https://dcrweb.herokuapp.com/](https://dcrweb.herokuapp.com/)

#### Updating the message catalog

When the master content changes in the HTML files, you'll need to re-generate the message catalog and push it to Transifex so that translators can update the localized message catalogs:

```sh
npm run transifex:push
```

#### Adding a new language

  1. Add the new language in Transifex
  2. In the repository folder, run `npm run transifex:pull`, add the new .po file to git: `git add i18n/po/<LC>.po`
  3. Enable it for publishing on the [staging site](https://dcrweb.herokuapp.com): add it to `src/i18n/languagemap.development.txt`
  4. Update language selector in `src/index.html`
  5. Commit files to git + push to repo

#### Publishing a language

Once you're happy with the translation in a language, you'll need to enable it for production.

  1. Add language to `src/i18n/languagemap.production.txt`
  2. Edit `#language-selector` in `src/index.html`
  3. Commit files to git + push to repo

## Deployment

A Docker configuration is included for building the deployable images (for the public web server and the API server).

### Prerequisites
  - NodeJS >= v6 (e.g. [nvm](https://github.com/creationix/nvm))
  - grunt: `npm install -g grunt-cli`

### Building the Docker images

```sh
git clone https://github.com/decred/dcrweb
cd dcrweb
npm install
npm run deploy:build
```

```sh
npm run deploy:preflight
```
Runs the docker image exposing port 8080: `http://localhost:8080`

### Push to Dockerhub

```sh
docker login
```

Enter your [Docker HUB](https://hub.docker.com/) credentials that has write access to the `decred/dcrweb` repository.

```sh
docker push decred/dcrweb
```

### Run in production

```sh
docker pull decred/dcrweb
docker run -d --rm -p [local port]]:80 decred/dcrweb:latest
```

Runs the docker image exposing the specified local port.

## Development

```sh
git clone https://github.com/decred/dcrweb
cd dcrweb
npm install
```

Start file watcher:

```sh
grunt watch
```

And in another terminal (in the same directory):
```sh
grunt serve
```
This will start the development web server at `http://localhost:8080`

## License

decredweb is licensed under the liberal ISC License.
