const {invoice_detailModel} = require("../models/invoice_detail_model")

exports.getListinvoice_detail = async (req, res, next) => {
    try {
        let listinvoice_detail = await invoice_detailModel.find({});
        res.json(listinvoice_detail);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};