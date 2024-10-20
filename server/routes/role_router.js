var express = require("express");
var router = express.Router();
const roleController = require("../controllers/role_controller");
router.get("/getListRole", roleController.getListrole);

router.post("/addrole",roleController.addrole)
router.put("/updaterole/:id",roleController.updaterole)
router.delete("/deleterole/:id",roleController.deleterole)
router.get("/getroleById/:id",roleController.getroleById)
module.exports = router;