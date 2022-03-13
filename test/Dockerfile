FROM decred/dcrweb:latest

WORKDIR /root

RUN apt-get update && apt-get install -y curl

COPY package.json run-test.sh ./

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION v14

RUN mkdir -p $NVM_DIR && \
    curl -s -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# install node and npm
RUN . $NVM_DIR/nvm.sh \
    && npm install

CMD ["bash", "-lc", "./run-test.sh"]
