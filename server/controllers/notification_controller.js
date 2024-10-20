const {notificationModel} = require("../models/notification_model")

exports.getListnotification = async (req, res, next) => {
    try {
        let listnotification = await notificationModel.find({});
        res.json(listnotification);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};
exports.addnotification = async (req, res, next) => {
    try {
        let obj = new notificationModel({
            order_date: req.body.order_date,
            total_price: req.body.total_price,
            status: req.body.status
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updatenotification = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.order_date = req.body.order_date
        obj.total_price = req.body.total_price
        obj.status = req.body.status
        let result = await notificationModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deletenotification = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await notificationModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getnotification = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await notificationModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getnotificationById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await notificationModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};