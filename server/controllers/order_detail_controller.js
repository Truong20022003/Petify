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


exports.getAllOrderDetailsWithStatus = async (req, res, next) => {
    try {
        let userId = req.params.user_id;
        // Tìm tất cả các chi tiết đơn hàng liên quan đến user_id
        let orderDetails = await order_detailModel.find({ user_id: userId })
            .populate({
                path: "order_id", // Populate bảng order
                select: "status", // Lấy trường status
            })
            .populate("product_id"); // Populate bảng product (nếu cần)

        // Chuyển đổi dữ liệu trả về với status của đơn hàng
        let result = orderDetails.map(detail => ({
            _id: detail._id,
            user_id: detail.user_id,
            product_id: detail.product_id,
            order_id: detail.order_id._id, // ID của đơn hàng
            order_status: detail.order_id.status, // Trạng thái của đơn hàng
            quantity: detail.quantity,
            total_price: detail.total_price,
        }));

        res.json(result);
    } catch (error) {
        res.json({ status: "Failed", result: error.message });
    }
};
