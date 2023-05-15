const { Router } = require("express");
const APP = require("./app");

const APPRouter = Router();

APPRouter.get("/", APP.initLedger);
APPRouter.get("/list", APP.getAllAssets);

APPRouter.get("/add", APP.createAsset);
APPRouter.get("/transfer", APP.transferAssetAsync);
APPRouter.get("/asset", APP.readAssetByID);
APPRouter.get("/error", APP.updateNonExistentAsset);
APPRouter.get("/config", APP.displayInputParameters);

module.exports = APPRouter;
