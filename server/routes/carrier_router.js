var express = require("express");
var router = express.Router();
const carrierController = require("../controllers/carrier_controller");
router.get("/getListCarier", carrierController.getListCarrier);
router.post("/addCarrier",carrierController.addCarrier)
router.put("/updateCarrier",carrierController.updateCarrier)
router.delete("/deleteCarrier",carrierController.deletecarrier)
router.get("/getCarrierById",carrierController.getCarrierById)
module.exports = router;