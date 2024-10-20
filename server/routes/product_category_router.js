var express = require("express");
var router = express.Router();
const product_categoryController = require("../controllers/product_category_controller");
router.get("/getListOroductCategory", product_categoryController.getListproduct_category);

router.post("/addproduct_category",product_categoryController.addproduct_category)
router.put("/updateproduct_category/:id",product_categoryController.updateproduct_category)
router.delete("/deleteproduct_category/:id",product_categoryController.deleteproduct_category)
router.get("/getproduct_categoryById/:id",product_categoryController.getproduct_categoryById)
module.exports = router;