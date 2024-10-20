const {productModel} = require("../models/product_model")

exports.getListproduct = async (req, res, next) => {
    try {
        let listproduct = await productModel.find({});
        res.json(listproduct);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};
exports.addproduct = async (req, res, next) => {
    try {
        let obj = new productModel({
            supplier_id: req.body.supplier_id,
            price: req.body.price,
            date: req.body.date,
            expiry_Date: req.body.expiry_Date,
            quantity: req.body.quantity,
            name: req.body.name,
            image: req.body.image,
            status: req.body.status,
            description: req.body.description,
            sale: req.body.sale,
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}

exports.updateproduct = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.supplier_id= req.body.supplier_id;
        obj.price= req.body.price;
        obj.date= req.body.date;
        obj.expiry_Date= req.body.expiry_Date;
        obj.quantity= req.body.quantity;
        obj.name= req.body.name;
        obj.image= req.body.image;
        obj.status= req.body.status;
        obj.description= req.body.description;
        obj.sale= req.body.sale;
        let result = await productModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleteproduct = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await productModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getproduct = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await productModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getproductById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await productModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};