var express = require("express");
var router = express.Router();
const notification_userController = require("../controllers/notification_user_controller");
router.get("/getListNotificationUser", notification_userController.getListnotification_user);

router.post("/addnotification_user",notification_userController.addnotification_user)
router.put("/updatenotification_user",notification_userController.updatenotification_user)
router.delete("/deletenotification_user",notification_userController.deletenotification_user)
router.get("/getnotification_userById",notification_userController.getnotification_userById)
module.exports = router;