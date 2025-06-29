var express = require("express");
var router = express.Router();
const { upload } = require("./uploads");
const productController = require("../controllers/product_controller");
router.get("/getListProduct", productController.getListproduct);
router.post("/addproduct", upload.array("image", 10), productController.addproduct)
router.put("/updateproduct/:id", upload.array("image", 10), productController.updateproduct)
router.delete("/deleteproduct/:id", productController.deleteproduct)
router.get("/getproductById/:id", productController.getproductById)
router.put("/updateSalePrice/:id/sale", productController.updateSalePrice);
router.get("/getProductsToday", productController.getProductsToday)
router.get("/getLatestSaleUpdatedProduct", productController.getLatestSaleUpdatedProduct)
router.put("/reduceProductQuantity/:id", productController.reduceProductQuantity);
router.get("/out-of-stock", productController.getOutOfStockProducts);

module.exports = router;