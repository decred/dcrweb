#!/bin/bash -e

# Setup
rm -rf docker-build
mkdir docker-build

# Build dcrweb
docker build . \
	-f ./Dockerfile-build \
	-t decred/dcrweb-build
if [ $? != 0 ]; then
	echo 'docker build failed'
	exit 1
fi

docker run --rm \
	-v $(pwd)/docker-build:/root/build \
	decred/dcrweb-build:latest
if [ $? != 0 ]; then
	echo 'docker run failed'
	exit 1
fi

# Build docker image to serve dcrweb
docker build . \
	-f ./Dockerfile-serve \
	-t decred/dcrweb
if [ $? != 0 ]; then
	echo 'docker build failed'
	exit 1
fi

echo ""
echo "==================="
echo "  Build complete"
echo "==================="
echo ""
echo "You can now run dcrweb with the following command:"
echo "    docker run -d --rm -p <local port>:80 decred/dcrweb:latest"
echo ""

# Cleanup
rm -rf docker-build
