var express = require("express");
var router = express.Router();
const invoiceController = require("../controllers/invoice_controller");
router.get("/getListInvoice", invoiceController.getListinvoice);

router.post("/addinvoice",invoiceController.addinvoice)
router.put("/updateinvoice/:id",invoiceController.updateinvoice)
router.delete("/deleteinvoice/:id",invoiceController.deleteinvoice)
router.get("/getinvoiceById/:id",invoiceController.getinvoiceById)
module.exports = router;