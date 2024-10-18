const {productModel} = require("../models/product_model")

exports.getListproduct = async (req, res, next) => {
    try {
        let listproduct = await productModel.find({});
        res.json(listproduct);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};