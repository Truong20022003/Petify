const {product_categoryModel} = require("../models/product_category_model")

exports.getListproduct_category = async (req, res, next) => {
    try {
        let listproduct_category = await product_categoryModel.find({});
        res.json(listproduct_category);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};