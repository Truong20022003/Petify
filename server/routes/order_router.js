var express = require("express");
var router = express.Router();
const orderController = require("../controllers/order_controller");
router.get("/getListOrder", orderController.getListorder);

router.post("/addorder",orderController.addorder)
router.put("/updateorder/:id",orderController.updateorder)
router.delete("/deleteorder/:id",orderController.deleteorder)
router.get("/getorderById/:id",orderController.getorderById)
module.exports = router;