var express = require("express");
var router = express.Router();
const userController = require("../controllers/user_controller");
router.get("/getListUser", userController.getListuser);

router.post("/adduser",userController.adduser)
router.put("/updateuser",userController.updateuser)
router.delete("/deleteuser",userController.deleteuser)
router.get("/getuserById",userController.getuserById)
module.exports = router;