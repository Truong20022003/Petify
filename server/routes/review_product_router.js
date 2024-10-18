var express = require("express");
var router = express.Router();
const review_productController = require("../controllers/review_product_controller");
router.get("/getListReviewProduct", review_productController.getListreview_product);

module.exports = router;