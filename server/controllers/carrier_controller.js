const {carrierModel} = require("../models/carrier_model")

exports.getListCarrier = async (req, res, next) => {
    try {
        let listCarrier = await carrierModel.find({});
        res.json(listCarrier);
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.addCarrier = async (req, res, next) => {
    try {
        let obj = new carrierModel({
            name: req.body.name,
            phone: req.body.phone
        })
        
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updateCarrier = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.name= req.body.name;
        obj.phone= req.body.phone;
        let result = await carrierModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deletecarrier = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await carrierModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getcarrier = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await carrierModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getCarrierById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await carrierModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};