const {review_productModel} = require("../models/review_product_model")

exports.getListreview_product = async (req, res, next) => {
    try {
        let listreview_product = await review_productModel.find({});
        res.json(listreview_product);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};