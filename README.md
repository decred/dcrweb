dcrweb
======

This is the code for the [decred.org](https://www.decred.org) website.

[![Build Status](https://travis-ci.org/decred/dcrweb.png?branch=master)](https://travis-ci.org/decred/dcrweb)
[![ISC License](http://img.shields.io/badge/license-ISC-blue.svg)](http://copyfree.org)


#### Downloading web site code

Make sure you have [git](https://git-scm.com/) installed.

```sh
git clone https://github.com/decred/dcrweb
```

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

#### Editing content

`dcrweb` is built using the [Hugo](https://gohugo.io/) site generator framework.  The most frequently updated content sections live in the below locations:


| Section | File | Comments |
| --- | --- | --- | 
| Press releases | `src/content/press/*.md` | When adding a new release, please follow the file naming convention in the directory.
| Press coverage | `src/data/press/coverage.yml` ||
| Download links | `src/data/wallets/links.yml` ||
| Current release | `src/data/wallets/current_release.yml` | The current release as it appears in the footer|
| Contributors      |  `src/data/contributors/*.yml` | Avatar images: `src/assets/images/contributors` |
| Community channels    | `src/data/community/channels.yml` |Logo images: `src/assets/images/community` |
| Exchanges             | `src/data/exchanges.*.yml` | Logo images: `src/assets/images/exchanges`|

The other sections live under `src/layouts`.  These pages are implemented as [Hugo templates](https://gohugo.io/templates/) and are [localized](https://gohugo.io/content-management/multilingual/#translation-of-strings).  The message catalogs can be found in `src/i18n`, when making changes in the templates, you'll want to keep the strings in the catalogs, please follow the naming scheme in the existing templates.    

## Testing

Run the HTML validator to make sure all of the generated files are syntactically correct.  (The script depends on `yarn` and `docker` being installed.)


```sh
yarn && yarn test
```


## Localization

The below commands must be run when either the content changes or there are updates in the translations in Transifex.  You'll first need to install the [Transifex client](https://docs.transifex.com/client/installing-the-client).


#### Importing new translations and content updates

When translations are added/updated in [Transifex](https://www.transifex.com/decred/public/), pull the updates:

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

### Building the Docker image for deployment

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

## License

dcrweb is licensed under the liberal ISC License.
