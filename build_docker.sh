#!/usr/bin/env bash

set -ex

# Requires docker 17.05 or higher
# Build docker image to serve dcrweb
docker build -t decred/dcrweb .

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
