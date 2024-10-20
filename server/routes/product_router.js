var express = require("express");
var router = express.Router();
const productController = require("../controllers/product_controller");
router.get("/getListProduct", productController.getListproduct);

router.post("/addproduct",productController.addproduct)
router.put("/updateproduct",productController.updateproduct)
router.delete("/deleteproduct",productController.deleteproduct)
router.get("/getproductById",productController.getproductById)
module.exports = router;