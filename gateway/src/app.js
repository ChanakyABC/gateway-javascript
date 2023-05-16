const { Connection } = require("./connection");
const config = require("./config");
const utf8Decoder = new TextDecoder();
const connection = new Connection("org1");
const contract = connection.getContract();

const initLedger = async (req, res) => {
  await contract.submitTransaction("InitLedger");
  return res.json({ success: true, message: "InitLedger" });
};

const closeConnection = async (req, res) => {
  await connection.close();
  return res.json({ success: true, message: "Connection is closed!" });
};

const getAllAssets = async (req, res) => {
  const resultBytes = await contract.evaluateTransaction("GetAllAssets");
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  return res.json(result);
};

async function createAsset(req,res) {
  console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments');

  var asset = req.body;
  await contract.submitTransaction(
      'CreateAsset',
      asset.id,
      asset.color,
      asset.size,
      asset.owner,
      asset.appraisedvalue,
      
  );

  console.log('*** Transaction committed successfully');
  res.send("Transaction committed successfully");

}

/**
* Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
* while waiting for the commit notification.
*/
async function transferAssetAsync(req,res) {
  console.log('\n--> Async Submit Transaction: TransferAsset, updates existing asset owner');
  const asset = req.body
  const commit = await contract.submitAsync('TransferAsset', {
      arguments: [asset.id, asset.newOwner],
  });
  const oldOwner = utf8Decoder.decode(commit.getResult());

  console.log(`*** Successfully submitted transaction to transfer ownership from ${oldOwner} to ${asset.newOwner}`);
  console.log('*** Waiting for transaction commit');

  const status = await commit.getStatus();
  if (!status.successful) {
      throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${status.code}`);
  }

  console.log('*** Transaction committed successfully');
  res.send(`*** Successfully submitted transaction to transfer ownership from ${oldOwner} to ${asset.newOwner}`);

}

async function readAssetByID(req,res) {
  console.log('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');
  const assetId = req.params.id;
  const resultBytes = await contract.evaluateTransaction('ReadAsset', assetId);
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  res.send(result);
}

async function getOwnershipHistory(req,res) {
  // console.log('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');
  const assetId = req.params.id;
  const resultBytes = await contract.submitTransaction('GetListOfOwners', assetId);
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  res.send(result);
}

async function deleteAsset(req,res) {
  console.log('\n--> Submit Transaction: DeleteAsset, function returns message.');
  const assetId = req.params.id;
  const resultBytes = await contract.submitTransaction('DeleteAsset', 'asset11');
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  return res.send(result);
  // return res.json({ success: true, message: "Asset removed." });
}

/**
* submitTransaction() will throw an error containing details of any error responses from the smart contract.
*/
async function updateNonExistentAsset(req,res){
  // const connection = new Connection("org1");
  // const contract = connection.getContract();
  console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');

  try {
      await contract.submitTransaction(
          'UpdateAsset',
          'asset70',
          'blue',
          '5',
          'Tomoko',
          '300',
      );
      console.log('******** FAILED to return an error');
  } catch (error) {
      console.log('*** Successfully caught the error: \n', error);
  }
}

/**
* envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
*/
// function envOrDefault(key, defaultValue) {
//   return process.env[key] || defaultValue;
// }

/**
* displayInputParameters() will print the global scope parameters used by the main driver routine.
*/
async function displayInputParameters(){
  console.log(`channelName:       ${channelName}`);
  console.log(`chaincodeName:     ${chaincodeName}`);
  console.log(`mspId:             ${mspId}`);
  console.log(`cryptoPath:        ${cryptoPath}`);
  console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
  console.log(`certPath:          ${certPath}`);
  console.log(`tlsCertPath:       ${tlsCertPath}`);
  console.log(`peerEndpoint:      ${peerEndpoint}`);
  console.log(`peerHostAlias:     ${peerHostAlias}`);
}

const APP = { initLedger, closeConnection, getAllAssets, createAsset, transferAssetAsync, readAssetByID, getOwnershipHistory, deleteAsset, updateNonExistentAsset, displayInputParameters };

module.exports = APP;
