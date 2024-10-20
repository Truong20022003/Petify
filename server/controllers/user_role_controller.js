const {user_roleModel} = require("../models/user_role_model")

exports.getListuser_role = async (req, res, next) => {
    try {
        let listuser_role = await user_roleModel.find({});
        res.json(listuser_role);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};
exports.adduser_role = async (req, res, next) => {
    try {
        let obj = new user_roleModel({
            user_id: req.body.user_id,
            role_id: req.body.role_id
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updateuser_role = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.user_id= req.body.user_id;
        obj.role_id= req.body.role_id;
        let result = await user_roleModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleteuser_role = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await user_roleModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getuser_role = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await user_roleModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getuser_roleById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await user_roleModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};