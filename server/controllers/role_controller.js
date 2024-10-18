const {roleModel} = require("../models/role_model")

exports.getListrole = async (req, res, next) => {
    try {
        let listrole = await roleModel.find({});
        res.json(listrole);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};