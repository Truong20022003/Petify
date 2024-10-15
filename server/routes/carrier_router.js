var express = require("express");
var router = express.Router();
const carrierController = require("../controllers/carrier_controller");
router.get("/getListCarier", carrierController.getListCarrier);

module.exports = router;