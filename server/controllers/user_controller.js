const {userModel} = require("../models/user_model")

exports.getListuser = async (req, res, next) => {
    try {
        let listuser = await userModel.find({});
        res.json(listuser);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};


exports.adduser = async (req, res, next) => {
    try {
        let obj = new userModel({
            name: req.body.name,
            email: req.body.email,
            phone_number: req.body. phone_number,
            password: req.body.password,
            user_name: req.body.user_name,
            location: req.body.location,
            avata: req.body.avata,
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updateuser = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.name= req.body.name;
        obj.email= req.body.email;
        obj.phone_number= req.body.phone_number;
        obj.password= req.body.password;
        obj.user_name= req.body.user_name;
        obj.location= req.body.location;
        obj.avata= req.body.avata;
        let result = await userModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleteuser = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await userModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getuser = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getuserById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};