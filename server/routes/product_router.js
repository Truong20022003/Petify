var express = require("express");
var router = express.Router();
const { upload } = require("./uploads");
const productController = require("../controllers/product_controller");
router.get("/getListProduct", productController.getListproduct);
router.post("/addproduct", upload.array("image", 10), productController.addproduct)
router.put("/updateproduct/:id", upload.array("image", 10), productController.updateproduct)
router.delete("/deleteproduct/:id", productController.deleteproduct)
router.get("/getproductById/:id", productController.getproductById)
router.get("/getProductsToday", productController.getProductsToday)

module.exports = router;