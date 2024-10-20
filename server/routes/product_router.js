var express = require("express");
var router = express.Router();
const productController = require("../controllers/product_controller");
router.get("/getListProduct", productController.getListproduct);

router.post("/addproduct",productController.addproduct)
router.put("/updateproduct/:id",productController.updateproduct)
router.delete("/deleteproduct/:id",productController.deleteproduct)
router.get("/getproductById/:id",productController.getproductById)
module.exports = router;