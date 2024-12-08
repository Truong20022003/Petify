const {invoice_detailModel} = require("../models/invoice_detail_model")

exports.getListinvoice_detail = async (req, res, next) => {
    try {
        let listinvoice_detail = await invoice_detailModel.find({});
        res.json(listinvoice_detail);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};

exports.addinvoice_detail = async (req, res, next) => {
    try {
        let obj = new invoice_detailModel({
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            invoice_id: req.body.invoice_id,
            quantity: req.body.quantity,
            total_price: req.body.total_price,
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updateinvoice_detail = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.user_id = req.body.user_id
        obj.product_id = req.body.product_id
        obj.invoice_id = req.body.invoice_id
        obj.quantity = req.body.quantity
        obj.total_price = req.body.total_price
        let result = await invoice_detailModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleteinvoice_detail = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await invoice_detailModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getinvoice_detail = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await invoice_detailModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getinvoice_detailById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await invoice_detailModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getAllInvoiceDetailsByUserId = async (req, res, next) => {
    try {
        let userId = req.params.user_id;
        // Tìm tất cả các chi tiết hóa đơn liên quan đến user_id
        let invoiceDetails = await invoice_detailModel.find({ user_id: userId })
            .populate({
                path: "product_id", // Liên kết bảng product
                select: "-__v", // Loại bỏ trường không cần thiết (ví dụ: versionKey)
            })
            .populate("invoice_id"); // Liên kết bảng invoice

        res.json( invoiceDetails);
    } catch (error) {
        res.json({ status: "Failed", result: error.message });
    }
};
