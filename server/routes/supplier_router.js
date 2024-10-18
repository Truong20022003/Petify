var express = require("express");
var router = express.Router();
const supplierController = require("../controllers/supplier_controller");
router.get("/getListSupplier", supplierController.getListsupplier);

module.exports = router;