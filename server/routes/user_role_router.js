var express = require("express");
var router = express.Router();
const user_roleController = require("../controllers/user_role_controller");
router.get("/getListUserRole", user_roleController.getListuser_role);

router.post("/adduser_role",user_roleController.adduser_role)
router.put("/updateuser_role/:id",user_roleController.updateuser_role)
router.delete("/deleteuser_role/:id",user_roleController.deleteuser_role)
router.get("/getuser_roleById/:id",user_roleController.getuser_roleById)
router.get("/get-Roles-By-UserId/:id",user_roleController.getRolesByUserId)
router.get("/get-Users-By-RoleId/:id",user_roleController.getUsersByRoleId)
module.exports = router;