const {supplierModel} = require("../models/supplier_model")

exports.getListsupplier = async (req, res, next) => {
    try {
        let listsupplier = await supplierModel.find({});
        res.json(listsupplier);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};

exports.addsupplier = async (req, res, next) => {
    try {
        let obj = new supplierModel({
            name: req.body.name
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updatesupplier = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.name= req.body.name;
        let result = await supplierModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deletesupplier = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await supplierModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getsupplier = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await supplierModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getsupplierById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await supplierModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};