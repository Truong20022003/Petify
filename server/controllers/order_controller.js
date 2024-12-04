const { orderModel } = require("../models/order_model")

exports.getListorder = async (req, res, next) => {
    try {
        let listorder = await orderModel.find({});
        res.json(listorder);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};
exports.addorder = async (req, res, next) => {
    try {
        const generateCode = () => {
            const min = 112312;
            const max = 999999;
            return `#${Math.floor(Math.random() * (max - min + 1)) + min}`;
        };
        let obj = new orderModel({
            user_id: req.body.user_id,
            oder_date: req.body.oder_date,
            total_price: req.body.total_price,
            status: req.body.status,
            payment_method: req.body.payment_method,
            delivery_address: req.body.delivery_address,
            shipping_fee: req.body.shipping_fee,
            code: generateCode()
        });
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        console.error("Error adding order:", error.message, error.stack);
        res.json({ status: "Add failed", error: error.message });
    }
};


exports.updateorder = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.user_id = req.body.user_id;
        obj.oder_date = req.body.oder_date;
        obj.total_price = req.body.total_price;
        obj.payment_method = req.body.payment_method
        obj.delivery_address = req.body.delivery_address
        obj.shipping_fee = req.body.shipping_fee
        obj.status = req.body.status;
        let result = await orderModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleteorder = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await orderModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getorder = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await orderModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getorderById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await orderModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};