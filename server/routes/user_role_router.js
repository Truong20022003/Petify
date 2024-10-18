var express = require("express");
var router = express.Router();
const user_roleController = require("../controllers/user_role_controller");
router.get("/getListUserRole", user_roleController.getListuser_role);

module.exports = router;