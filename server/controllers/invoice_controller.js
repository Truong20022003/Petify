const {invoiceModel} = require("../models/invoice_Model")

exports.getListinvoice = async (req, res, next) => {
    try {
        let listinvoice = await invoiceModel.find({});
        res.json(listinvoice);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};

exports.addinvoice = async (req, res, next) => {
    try {
        let obj = new invoiceModel({
            user_id: req.body.user_id,
            total: req.body.total,
            date: req.body.date,
            status: req.body.status,
            payment_method: req.body.payment_method,
            delivery_address: req.body.delivery_address,
            shipping_fee: req.body.shipping_fee,
            carrier_id: req.body.carrier_id,
            order_id: req.body.order_id
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updateinvoice = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.user_id= req.body.user_id
        obj.total= req.body.total
        obj.date= req.body.date
        obj.status= req.body.status
        obj.payment_method= req.body.payment_method
        obj.delivery_address= req.body.delivery_address
        obj.shipping_fee= req.body.shipping_fee
        obj.carrier_id= req.body.carrier_id
        obj.order_id= req.body.order_id
        let result = await invoiceModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleteinvoice = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await invoiceModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getinvoice = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await invoiceModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getinvoiceById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await invoiceModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};