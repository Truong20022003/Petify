const { product_categoryModel } = require("../models/product_category_model")

exports.getListproduct_category = async (req, res, next) => {
    try {
        let listproduct_category = await product_categoryModel.find({});
        res.json(listproduct_category);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};
exports.addproduct_category = async (req, res, next) => {
    try {
        let obj = new product_categoryModel({
            product_id: req.body.product_id,
            category_id: req.body.category_id
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({ status: "Add failed" })
    }
}

exports.updateproduct_category = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.product_id = req.body.product_id;
        obj.category_id = req.body.category_id;
        let result = await product_categoryModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleteproduct_category = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await product_categoryModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getproduct_category = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await product_categoryModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getproduct_categoryById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await product_categoryModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
exports.getProductCategoryByProductId = async (req, res, next) => {
    try {
        let productId = req.params.product_id;
        let result = await product_categoryModel.find({ product_id: productId });
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getProductCategoryByCategoryId = async (req, res, next) => {
    try {
        let categoryId = req.params.category_id;
        let result = await product_categoryModel.find({ category_id: categoryId });
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getProductsGroupedByCategory = async (req, res, next) => {
    try {
        let groupedProducts = await product_categoryModel.aggregate([
            {
                $addFields: { 
                    product_id: { $toObjectId: "$product_id" } 
                }
            },
            {
                $lookup: {
                    from: "product", // tên collection sản phẩm
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $group: {
                    _id: "$category_id",
                    product: { $push: "$product"}
                }
            }
        ]);
        
        res.json({ status: "Successfully", result: groupedProducts });
    } catch (error) {
        res.json({ status: "Failed to group products by category", result: error });
    }
};
