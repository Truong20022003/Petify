var express = require("express");
var router = express.Router();
const notification_userController = require("../controllers/notification_user_controller");
router.get("/getListNotificationUser", notification_userController.getListnotification_user);

router.post("/addnotification_user",notification_userController.addnotification_user)
router.put("/updatenotification_user/:id",notification_userController.updatenotification_user)
router.delete("/deletenotification_user/:id",notification_userController.deletenotification_user)
router.get("/getnotification_userById/:id",notification_userController.getnotification_userById)
router.get("/getnotification-by-id-user/:id",notification_userController.getNotificationByUser)
router.get("/get-user-by-notification/:id",notification_userController.getUserByNotification)
module.exports = router;