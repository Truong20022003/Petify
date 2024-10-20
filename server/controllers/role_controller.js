const {roleModel} = require("../models/role_model")

exports.getListrole = async (req, res, next) => {
    try {
        let listrole = await roleModel.find({});
        res.json(listrole);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};
exports.addrole = async (req, res, next) => {
    try {
        let obj = new roleModel({
            name: req.body.name,
            description: req.body.description
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updaterole = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.name= req.body.name;
        obj.description= req.body.description;
        let result = await roleModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleterole = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await roleModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getrole = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getroleById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};