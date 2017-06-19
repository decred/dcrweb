dcrweb
======

This is the code for the [decred.org](https://www.decred.org) website.

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

## Localization

The below commands must be run when either the content changes or there are updates in the translations in Transifex.  You'll first need to install the [Transifex client](https://docs.transifex.com/client/installing-the-client).

#### Updating the message catalog

When the master content changes in the HTML files, you'll need to re-generate the message catalog and push it to Transifex so that translators can update the localized message catalogs:

```sh
npm run transifex:push
```

#### Importing new translations and content updates

When translations are added/updated in Transifex, pull the updates:

```sh
npm run transifex:pull
```
Then rebuild.

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


## License

decredweb is licensed under the liberal ISC License.
