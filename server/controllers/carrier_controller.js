const {carrierModel} = require("../models/carrier_model")

exports.getListCarrier = async (req, res, next) => {
    try {
        let listCarrier = await carrierModel.find({});
        res.json(listCarrier);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};