const {user_roleModel} = require("../models/user_role_model")

exports.getListuser_role = async (req, res, next) => {
    try {
        let listuser_role = await user_roleModel.find({});
        res.json(listuser_role);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};