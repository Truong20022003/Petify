const {notificationModel} = require("../models/notification_model")
const admin = require("../db/firebase_admin");
exports.getListnotification = async (req, res, next) => {
    try {
        let listnotification = await notificationModel.find({});
        res.json(listnotification);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};

exports.saveToken = async (req, res) => {
    const { fcmToken } = req.body;
    if (!fcmToken) {
        return res.status(400).json({ message: "Token is required" });
    }
    try {
        await TokenModel.updateOne({ userId: req.user.id }, { fcmToken }, { upsert: true });
        res.json({ message: "Token saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save token" });
    }
};

exports.addnotification = async (req, res, next) => {
    try {
        let obj = new notificationModel({
            order_date: req.body.order_date,
            total_price: req.body.total_price,
            status: req.body.status
        });
        let result = await obj.save();
        const userToken = await TokenModel.findOne({ userId: req.body.userId });
        const message = {
            notification: {
                title: "Thông báo mới",
                body: `Đơn hàng của bạn đã được thêm với giá trị: ${req.body.total_price}`
            },
            token: userToken?.fcmToken || "" 
        };

        try {
            const response = await admin.messaging().send(message);
            console.log("Notification sent successfully:", response);
            res.json({ status: "Add successfully and notification sent", result: result });
        } catch (error) {
            console.error("Error sending notification:", error);
            res.json({ status: "Add successfully, but notification failed", result: result });
        }
    } catch (error) {
        res.json({ status: "Add failed" });
    }
};


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