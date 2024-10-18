var express = require("express");
var router = express.Router();
const roleController = require("../controllers/role_controller");
router.get("/getListRole", roleController.getListrole);

module.exports = router;