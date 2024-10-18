var express = require("express");
var router = express.Router();
const invoiceController = require("../controllers/invoice_controller");
router.get("/getListInvoice", invoiceController.getListinvoice);

module.exports = router;