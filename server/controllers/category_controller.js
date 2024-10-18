const {categoryModel} = require("../models/category_model")

exports.getListcategory = async (req, res, next) => {
    try {
        let listcategory = await categoryModel.find({});
        res.json(listcategory);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};