#!/bin/bash

export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"javascript"}
# CC_SRC_PATH="../chaincode/asset_transfer"
CC_SRC_PATH="../chaincode-javascript"

# launch network; create channel and join peer to channel
pushd ../../../fabric-samples/test-network
# pushd ../../test-network

# 
./network.sh down
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -q)

./network.sh up createChannel -ca  -s couchdb
# ./network.sh deployCC -ccn basic -ccp ../../projects/gateway-javascript/chaincode/asset_transfer -ccl javascript
./network.sh deployCC -ccn basic -ccp ../../projects/gateway-javascript/chaincode-javascript -ccl javascript

popd	