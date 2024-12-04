var express = require("express");
var router = express.Router();
const favoritesController = require("../controllers/favorites_controller");
router.get("/getListfavorites", favoritesController.getFavoritesByUserId);
router.post("/addTofavorites",favoritesController.addFavorites)
router.delete('/delete/:product_id/:user_id', favoritesController.deleteFavoriteByProductIdAndUserId);
module.exports = router;