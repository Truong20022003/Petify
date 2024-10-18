var express = require("express");
var router = express.Router();
const userController = require("../controllers/user_controller");
router.get("/getListUser", userController.getListuser);

module.exports = router;