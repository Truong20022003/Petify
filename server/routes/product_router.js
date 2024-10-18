var express = require("express");
var router = express.Router();
const productController = require("../controllers/product_controller");
router.get("/getListProduct", productController.getListproduct);

module.exports = router;