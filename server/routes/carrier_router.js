var express = require("express");
var router = express.Router();
const carrierController = require("../controllers/carrier_controller");
router.get("/getListCarier", carrierController.getListCarrier);
router.post("/addCarrier",carrierController.addCarrier)
router.put("/updateCarrier/:id",carrierController.updateCarrier)
router.delete("/deleteCarrier/:id",carrierController.deletecarrier)
router.get("/getCarrierById/:id",carrierController.getCarrierById)
module.exports = router;