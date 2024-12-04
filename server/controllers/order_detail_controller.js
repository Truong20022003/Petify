const {order_detailModel} = require("../models/order_detail_model")

exports.getListorder_detail = async (req, res, next) => {
    try {
        let listorder_detail = await order_detailModel.find({});
        res.json(listorder_detail);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};

exports.addorder_detail = async (req, res, next) => {
    try {
        let obj = new order_detailModel({
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            order_id: req.body.order_id,
            quantity: req.body.quantity,
            total_price: req.body.total_price,
        })
        let result = await obj.save();
        console.log(result)
        res.json(result);
    } catch (error) {
        console.log(error)
        res.json({status: "Add failed" })
    }
}

exports.updateorder_detail = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.user_id = req.body.user_id
        obj.product_id = req.body.product_id
        obj.order_id = req.body.order_id
        obj.quantity = req.body.quantity
        obj.total_price = req.body.total_price
        let result = await order_detailModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleteorder_detail = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await order_detailModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getorder_detail = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await order_detailModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getorder_detailById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await order_detailModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};