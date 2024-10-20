var express = require("express");
var router = express.Router();
const categoryController = require("../controllers/category_controller");
router.get("/getListCategory", categoryController.getListcategory);
router.post("/addcategory",categoryController.addcategory)
router.put("/updatecategory/:id",categoryController.updatecategory)
router.delete("/deletecategory/:id",categoryController.deletecategory)
router.get("/getcategoryById/:id",categoryController.getcategoryById)

module.exports = router;