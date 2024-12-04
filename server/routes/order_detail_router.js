var express = require("express");
var router = express.Router();
const order_detailController = require("../controllers/order_detail_controller");
router.get("/getListorderDetail", order_detailController.getListorder_detail);
router.post("/addorder_detail",order_detailController.addorder_detail)
router.put("/updateorder_detail/:id",order_detailController.updateorder_detail)
router.delete("/deleteorder_detail/:id",order_detailController.deleteorder_detail)
router.get("/getorder_detailById/:id",order_detailController.getorder_detailById)
module.exports = router;