var express = require("express");
var router = express.Router();
const product_categoryController = require("../controllers/product_category_controller");
router.get("/getListOroductCategory", product_categoryController.getListproduct_category);

module.exports = router;