const { orderModel } = require("../models/order_model")
const { order_detailModel } = require("../models/order_detail_model")
const { invoiceModel } = require("../models/invoice_model")
const { invoice_detailModel } = require("../models/invoice_detail_model")
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
        res.json(result);
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
exports.ProcessOrder = async (req, res, next) => {
    const orderId = req.params.id;
    try {
        // Lấy đơn hàng theo ID
        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ message: "Đơn hàng không tồn tại." });

        // Kiểm tra trạng thái đơn hàng
        if (order.status !== "Thành công") {
            return res.status(400).json({ message: "Đơn hàng chưa ở trạng thái thành công." });
        }

        // Lấy chi tiết đơn hàng
        const orderDetails = await order_detailModel.find({ order_id: orderId });

        // Tạo hóa đơn (invoice)
        const invoice = new invoiceModel({
            user_id: order.user_id,
            total: order.total_price,
            payment_method: order.payment_method,
            delivery_address: order.delivery_address,
            date: order.oder_date,
            status: order.status,
            shipping_fee: order.shipping_fee,
            carrier_id: order.carrier_id,
            createdAt: new Date(),
            order_id: orderId  // Thêm order_id vào hóa đơn
        });

        // Lưu hóa đơn
        const savedInvoice = await invoice.save();

        // Tạo chi tiết hóa đơn (invoice_detail)
        const invoiceDetails = orderDetails.map((detail) => ({
            invoice_id: savedInvoice._id,
            product_id: detail.product_id,
            quantity: detail.quantity,
            total_price: detail.total_price
        }));

        // Lưu chi tiết hóa đơn
        await invoice_detailModel.insertMany(invoiceDetails); // Đảm bảo insertMany được gọi trên model Mongoose

        // Xóa chi tiết đơn hàng và đơn hàng
        await order_detailModel.deleteMany({ order_id: orderId }); // Xóa chi tiết đơn hàng dựa trên order_id
        await order.deleteOne({ _id: orderId }); // Xóa đơn hàng

        // Lấy chi tiết hóa đơn đã lưu để trả về
        const savedInvoiceDetails = await invoice_detailModel.find({ invoice_id: savedInvoice._id });

        // Trả về kết quả thành công
        res.status(200).json({
            message: "Xử lý đơn hàng thành công.",
            invoice: savedInvoice,
            invoice_details: savedInvoiceDetails
        });

    } catch (error) {
        console.error("Lỗi xử lý đơn hàng:", error);
        res.status(500).json({ message: "Có lỗi xảy ra khi xử lý đơn hàng.", error: error.message });
    }
}

