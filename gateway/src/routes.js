const { Router } = require("express");
const APP = require("./app");

const APPRouter = Router();

APPRouter.get("/", APP.initLedger);
APPRouter.get("/close", APP.closeConnection);
APPRouter.get("/list", APP.getAllAssets);

APPRouter.post("/add", APP.createAsset);
APPRouter.put("/transfer", APP.transferAssetAsync);
APPRouter.get("/asset/:id", APP.readAssetByID);
APPRouter.get("/owners/:id", APP.getOwnershipHistory);
APPRouter.delete("/remove/:id", APP.deleteAsset);
APPRouter.put("/error", APP.updateNonExistentAsset);
APPRouter.get("/config", APP.displayInputParameters);

module.exports = APPRouter;
