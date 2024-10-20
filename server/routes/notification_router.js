var express = require("express");
var router = express.Router();
const notificationController = require("../controllers/notification_controller");
router.get("/getListNotification", notificationController.getListnotification);

router.post("/addnotification",notificationController.addnotification)
router.put("/updatenotification/:id",notificationController.updatenotification)
router.delete("/deletenotification/:id",notificationController.deletenotification)
router.get("/getnotificationById/:id",notificationController.getnotificationById)
module.exports = router;