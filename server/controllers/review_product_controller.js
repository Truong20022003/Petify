const { review_productModel } = require("../models/review_product_model")

exports.getListreview_product = async (req, res, next) => {
    try {
        let listreview_product = await review_productModel.find({});
        res.json(listreview_product);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};
exports.addreview_product = async (req, res, next) => {
    try {
        let obj = new review_productModel({
            review_id: req.body.review_id,
            product_id: req.body.product_id
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({ status: "Add failed" })
    }
}

exports.updatereview_product = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.review_id = req.body.review_id;
        obj.product_id = req.body.product_id;
        let result = await review_productModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deletereview_product = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await review_productModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getreview_product = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await review_productModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getreview_productById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await review_productModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};