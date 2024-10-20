const {categoryModel} = require("../models/category_model")

exports.getListcategory = async (req, res, next) => {
    try {
        let listcategory = await categoryModel.find({});
        res.json(listcategory);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};

exports.addcategory = async (req, res, next) => {
    try {
        let obj = new categoryModel({
            name: req.body.name,
            image: req.body.image
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updatecategory = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.name= req.body.name;
        obj.image= req.body.image;
        let result = await categoryModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deletecategory = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await categoryModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getcategory = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await categoryModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getcategoryById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await categoryModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};