var express = require("express");
var router = express.Router();
const invoiceController = require("../controllers/invoice_controller");
router.get("/getListInvoice", invoiceController.getListinvoice);

router.post("/addinvoice",invoiceController.addinvoice)
router.put("/updateinvoice",invoiceController.updateinvoice)
router.delete("/deleteinvoice",invoiceController.deleteinvoice)
router.get("/getinvoiceById",invoiceController.getinvoiceById)
module.exports = router;