const {invoiceModel} = require("../models/invoice_Model")

exports.getListinvoice = async (req, res, next) => {
    try {
        let listinvoice = await invoiceModel.find({});
        res.json(listinvoice);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};