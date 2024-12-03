var express = require("express");
var router = express.Router();
const cartController = require("../controllers/cart_controller");
router.get("/getListCart/:user_id", cartController.getCartByUserId);
router.post("/addToCart",cartController.addCart)
router.put('/update-quantity', cartController.updateQuantityInCart);
router.delete('/delete/:product_id/:user_id', cartController.deleteCartByProductIdAndUserId);
module.exports = router;