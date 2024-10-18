const {reviewModel} = require("../models/review_model")

exports.getListreview = async (req, res, next) => {
    try {
        let listreview = await reviewModel.find({});
        res.json(listreview);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};