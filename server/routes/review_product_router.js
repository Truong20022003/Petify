var express = require("express");
var router = express.Router();
const review_productController = require("../controllers/review_product_controller");
router.get("/getListReviewProduct", review_productController.getListreview_product);

router.post("/addreview_product",review_productController.addreview_product)
router.put("/updatereview_product",review_productController.updatereview_product)
router.delete("/deletereview_product",review_productController.deletereview_product)
router.get("/getreview_productById",review_productController.getreview_productById)
module.exports = router;