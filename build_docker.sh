#!/bin/bash -e
# Requires docker 17.05 and higher

# Build docker image to serve dcrweb
docker build . \
	-f ./Dockerfile \
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

# Remove build output dir
rm -rf docker-build
