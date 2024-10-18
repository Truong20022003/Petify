const {notification_userModel} = require("../models/notification_user_model")

exports.getListnotification_user = async (req, res, next) => {
    try {
        let listnotification_user = await notification_userModel.find({});
        res.json(listnotification_user);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};