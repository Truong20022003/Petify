var express = require("express");
var router = express.Router();
const userController = require("../controllers/user_controller");
router.get("/getListUser", userController.getListuser);

router.post("/adduser",userController.adduser)
router.put("/updateuser/:id",userController.updateuser)
router.delete("/deleteuser/:id",userController.deleteuser)
router.get("/getuserById/:id",userController.getuserById)
module.exports = router;