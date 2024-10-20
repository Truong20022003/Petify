var express = require("express");
var router = express.Router();
const notificationController = require("../controllers/notification_controller");
router.get("/getListNotification", notificationController.getListnotification);

router.post("/addnotification",notificationController.addnotification)
router.put("/updatenotification",notificationController.updatenotification)
router.delete("/deletenotification",notificationController.deletenotification)
router.get("/getnotificationById",notificationController.getnotificationById)
module.exports = router;