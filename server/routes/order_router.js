var express = require("express");
var router = express.Router();
const orderController = require("../controllers/order_controller");
router.get("/getListOrder", orderController.getListorder);

module.exports = router;