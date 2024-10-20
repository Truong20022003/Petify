var express = require("express");
var router = express.Router();
const supplierController = require("../controllers/supplier_controller");
router.get("/getListSupplier", supplierController.getListsupplier);

router.post("/addsupplier",supplierController.addsupplier)
router.put("/updatesupplier",supplierController.updatesupplier)
router.delete("/deletesupplier",supplierController.deletesupplier)
router.get("/getsupplierById",supplierController.getsupplierById)
module.exports = router;