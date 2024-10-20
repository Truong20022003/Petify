var express = require("express");
var router = express.Router();
const supplierController = require("../controllers/supplier_controller");
router.get("/getListSupplier", supplierController.getListsupplier);

router.post("/addsupplier",supplierController.addsupplier)
router.put("/updatesupplier/:id",supplierController.updatesupplier)
router.delete("/deletesupplier/:id",supplierController.deletesupplier)
router.get("/getsupplierById/:id",supplierController.getsupplierById)
module.exports = router;