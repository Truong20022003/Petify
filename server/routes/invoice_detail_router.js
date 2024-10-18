var express = require("express");
var router = express.Router();
const invoice_detailController = require("../controllers/invoice_detail_controller");
router.get("/getListInvoiceDetail", invoice_detailController.getListinvoice_detail);

module.exports = router;