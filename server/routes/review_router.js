var express = require("express");
var router = express.Router();
const reviewController = require("../controllers/review_controller");
router.get("/getListReview", reviewController.getListreview);

router.post("/addreview",reviewController.addreview)
router.put("/updatereview/:id",reviewController.updatereview)
router.delete("/deletereview/:id",reviewController.deletereview)
router.get("/getreviewById/:id",reviewController.getreviewById)
module.exports = router;