const {supplierModel} = require("../models/supplier_model")

exports.getListsupplier = async (req, res, next) => {
    try {
        let listsupplier = await supplierModel.find({});
        res.json(listsupplier);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};