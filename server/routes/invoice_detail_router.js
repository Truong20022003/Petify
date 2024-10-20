var express = require("express");
var router = express.Router();
const invoice_detailController = require("../controllers/invoice_detail_controller");
router.get("/getListInvoiceDetail", invoice_detailController.getListinvoice_detail);

router.post("/addinvoice_detail",invoice_detailController.addinvoice_detail)
router.put("/updateinvoice_detail",invoice_detailController.updateinvoice_detail)
router.delete("/deleteinvoice_detail",invoice_detailController.deleteinvoice_detail)
router.get("/getinvoice_detailById",invoice_detailController.getinvoice_detailById)
module.exports = router;