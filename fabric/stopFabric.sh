#!/bin/bash


set -ex

# Bring the test network down
pushd ~/javascript/src/github.com/chanakyABC/fabric-samples/test-network
./network.sh down
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -q)
popd	



