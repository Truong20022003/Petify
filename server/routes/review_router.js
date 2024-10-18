var express = require("express");
var router = express.Router();
const reviewController = require("../controllers/review_controller");
router.get("/getListReview", reviewController.getListreview);

module.exports = router;