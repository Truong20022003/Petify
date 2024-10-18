const {notificationModel} = require("../models/notification_model")

exports.getListnotification = async (req, res, next) => {
    try {
        let listnotification = await notificationModel.find({});
        res.json(listnotification);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};