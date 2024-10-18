const {userModel} = require("../models/user_model")

exports.getListuser = async (req, res, next) => {
    try {
        let listuser = await userModel.find({});
        res.json(listuser);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};