const { notification_userModel } = require("../models/notification_user_model")

exports.getListnotification_user = async (req, res, next) => {
    try {
        let listnotification_user = await notification_userModel.find({});
        res.json(listnotification_user);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};

exports.addnotification_user = async (req, res, next) => {
    try {
        let obj = new notification_userModel({
            user_id: req.body.user_id,
            notification_id: req.body.notification_id
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({ status: "Add failed" })
    }
}

exports.updatenotification_user = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.user_id = req.body.user_id;
        obj.notification_id = req.body.notification_id;
        let result = await notification_userModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deletenotification_user = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await notification_userModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getnotification_user = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await notification_userModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getnotification_userById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await notification_userModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getNotificationByUser = async (req, res, next) => {
    try {
        let userId = req.params.user_id;
        let notifications = await notification_userModel.find({ user_id: userId });
        res.json({ status: "Successfully", result: notifications });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getUserByNotification = async (req, res, next) => {
    try {
        let notificationId = req.params.notification_id;
        let user = await notification_userModel.findOne({ notification_id: notificationId });
        res.json({ status: "Successfully", result: user });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
