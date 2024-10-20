var express = require("express");
var router = express.Router();
const roleController = require("../controllers/role_controller");
router.get("/getListRole", roleController.getListrole);

router.post("/addrole",roleController.addrole)
router.put("/updaterole",roleController.updaterole)
router.delete("/deleterole",roleController.deleterole)
router.get("/getroleById",roleController.getroleById)
module.exports = router;