dcrweb
======

This is the code for the [decred.org](https://www.decred.org) website.

[![Build Status](https://travis-ci.org/decred/dcrweb.png?branch=master)](https://travis-ci.org/decred/dcrweb)
[![ISC License](http://img.shields.io/badge/license-ISC-blue.svg)](http://copyfree.org)


## Localization

The below commands must be run when either the content changes or there are updates in the translations in Transifex.  You'll first need to install the [Transifex client](https://docs.transifex.com/client/installing-the-client).

#### Downloading web site code

Make sure you have [git](https://git-scm.com/) installed.

```sh
git clone https://github.com/decred/dcrweb
cd dcrweb;
```

#### Importing new translations and content updates

When translations are added/updated in [Transifex](https://www.transifex.com/decred/), pull the updates:

```sh
bin/transifex_pull.sh
```

When you run this for the first time, you'll be asked to log in with your Transifex username/password.

To push the changes to staging:

```sh
git commit -m'Translation update'
git push origin
```

#### Updating the message catalog

When the master content changes in the HTML files, you'll need to re-generate the message catalog and push it to Transifex so that translators can update the localized message catalogs:

```sh
bin/transifex_push.sh
```

## Deployment

A Docker configuration is included for building the deployable images of dcrweb.

### Prerequisites
  - docker

### Building the Docker images

```sh
bin/build.sh
```
This builds the docker image `decred/dcrweb`, which can then be run using:

```sh
docker run -d -p <local port>:80 decred/dcrweb:latest
```

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
docker run -d --rm -p <local port>:80 decred/dcrweb:latest
```

Runs the docker image exposing the specified local port.

## Development

1. Install prerequisites:

   * [Hugo](https://gohugo.io/)
   * Docker

2. Clone repo
    ```sh
    git clone https://github.com/decred/dcrweb
    cd dcrweb
    ```

3. Start development web server:
    ```sh
    bin/watch.sh
    ```

You should now be able to access the site at `http://localhost:1313`

## License

decredweb is licensed under the liberal ISC License.