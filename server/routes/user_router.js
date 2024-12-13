var express = require("express");
var router = express.Router();
const { upload } = require("../routes/uploads");
const userController = require("../controllers/user_controller");
router.get("/getListUser", userController.getListuser);

router.post("/adduser", upload.single("avata"), userController.adduser);
router.put("/updateuser/:id", upload.single("avata"), userController.updateuser);
router.delete("/deleteuser/:id", userController.deleteuser)
router.get("/getuserById/:id", userController.getuserById)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/reset-password', userController.resetPassword);
router.patch("/update-address/:id", userController.updateUserAddress)
router.get("/getNewUsers", userController.getNewUsers)


module.exports = router;