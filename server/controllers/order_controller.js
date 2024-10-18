const {orderModel} = require("../models/order_model")

exports.getListorder = async (req, res, next) => {
    try {
        let listorder = await orderModel.find({});
        res.json(listorder);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};