var express = require("express");
var router = express.Router();
const orderController = require("../controllers/order_controller");
router.get("/getListOrder", orderController.getListorder);

router.post("/addorder",orderController.addorder)
router.put("/updateorder",orderController.updateorder)
router.delete("/deleteorder",orderController.deleteorder)
router.get("/getorderById",orderController.getorderById)
module.exports = router;