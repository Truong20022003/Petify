var express = require("express");
var router = express.Router();
const notification_userController = require("../controllers/notification_user_controller");
router.get("/getListNotificationUser", notification_userController.getListnotification_user);

module.exports = router;