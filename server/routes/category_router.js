var express = require("express");
var router = express.Router();
const categoryController = require("../controllers/category_controller");
router.get("/getListCategory", categoryController.getListcategory);

module.exports = router;