var express = require("express");
var router = express.Router();
const reviewController = require("../controllers/review_controller");
router.get("/getListReview", reviewController.getListreview);

router.post("/addreview",reviewController.addreview)
router.put("/updatereview",reviewController.updatereview)
router.delete("/deletereview",reviewController.deletereview)
router.get("/getreviewById",reviewController.getreviewById)
module.exports = router;