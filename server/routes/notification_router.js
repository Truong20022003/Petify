var express = require("express");
var router = express.Router();
const notificationController = require("../controllers/notification_controller");
router.get("/getListNotification", notificationController.getListnotification);

module.exports = router;