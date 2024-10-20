var express = require("express");
var router = express.Router();
const categoryController = require("../controllers/category_controller");
router.get("/getListCategory", categoryController.getListcategory);
router.post("/addcategory",categoryController.addcategory)
router.put("/updatecategory",categoryController.updatecategory)
router.delete("/deletecategory",categoryController.deletecategory)
router.get("/getcategoryById",categoryController.getcategoryById)

module.exports = router;