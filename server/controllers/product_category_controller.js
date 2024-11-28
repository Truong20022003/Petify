const { product_categoryModel } = require("../models/product_category_model")
const { productModel } = require("../models/product_model");
const { categoryModel } = require("../models/category_model");
const mongoose = require('mongoose');
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
        console.log("Request body:", req.body);
        let obj = new product_categoryModel({
            product_id: req.body.product_id,
            category_id: req.body.category_id
        })
        let result = await obj.save();
        res.status(200).json({ status: "Add successfully", result: result });
    } catch (error) {
        res.status(500).json({ status: "Add failed" })
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
        let productId = req.params.id;
        let result = await product_categoryModel.find({ product_id: productId });
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getProductCategoryByCategoryId = async (req, res, next) => {
    try {
        let categoryId = req.params.id;
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
                    product_id: { $toObjectId: "$product_id" },
                    category_id: { $toObjectId: "$category_id" }
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "category",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $addFields: {
                    category_name: { $arrayElemAt: ["$category.name", 0] }
                }
            },
            // Giải nén mảng product nếu có
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true  // Giữ lại nếu không có sản phẩm
                }
            },
            {
                $group: {
                    _id: "$category_id",
                    category_name: { $first: "$category_name" },
                    product: { $push: "$product" }  // Sử dụng $push để gom lại các sản phẩm vào mảng phẳng
                }
            }
        ]);

        res.json({ status: "Successfully", result: groupedProducts });
    } catch (error) {
        res.json({ status: "Failed to group products by category", result: error });
    }
};
exports.getCategoriesByProduct = async (req, res, next) => {
    try {
        let groupedProducts = await product_categoryModel.aggregate([
            {
                $addFields: {
                    product_id: { $toObjectId: "$product_id" },
                    category_id: { $toObjectId: "$category_id" }
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "category",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true // Nếu sản phẩm không tồn tại, vẫn giữ lại dữ liệu
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true // Nếu loại sản phẩm không tồn tại, vẫn giữ lại dữ liệu
                }
            },
            {
                $group: {
                    _id: "$product_id",
                    product: { $first: "$product" }, // Giữ thông tin sản phẩm
                    categories: {
                        $push: {
                            category_id: "$category_id",
                            category_name: "$category.name"
                        }
                    }
                }
            }
        ]);

        res.json({ status: "Successfully", result: groupedProducts });
    } catch (error) {
        res.json({ status: "Failed to group products by category", result: error });
    }
};

exports.getCategoriesByProductId = async (req, res, next) => {
    try {
        const productId = req.params.id;
        console.log(productId)
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.json({ status: "Invalid product ID", result: {} });
        }

        let result = await product_categoryModel.aggregate([
            {
                $addFields: {
                    product_id: { $toObjectId: "$product_id" },
                    category_id: { $toObjectId: "$category_id" }
                }
            },
            {
                $match: {
                    product_id: { $eq: new mongoose.Types.ObjectId(productId) }
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "category",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $group: {
                    _id: "$product_id",
                    product: { $first: "$product" },
                    categories: {
                        $push: {
                            category_id: "$category_id",
                            category_name: "$category.name"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0
                }
            }
        ]);

        if (!result || result.length === 0) {
            return res.json({ status: "No data found for this product", result: [] });
        }

        res.json({ status: "Successfully", result: result[0] });
    } catch (error) {
        console.error("Error retrieving categories:", error); // Log lỗi chi tiết
        res.json({ status: "Failed to retrieve categories for product", result: error.message });
    }
};

exports.removeCategoryFromProduct = async (req, res, next) => {
    try {
        const productId = req.params.product_id;
        const categoryId = req.body.category_id;

        const result = await product_categoryModel.findOneAndDelete({ product_id: productId, category_id: categoryId });
        if (result) {
            res.status(200).json({ status: "Category removed from Product successfully", result: result });
        } else {
            res.status(404).json({ status: "Category not found for the specified Product" });
        }
    } catch (error) {
        res.status(500).json({ status: "Failed to remove Category from Product", error: error.message });
    }
};

exports.addCategoryToProduct = async (req, res, next) => {
    try {
        const productId = req.params.product_id;
        const categoryId = req.body.category_id;
        console.log(productId, "productId")
        console.log(categoryId, "categoryId")

        const existingRole = await product_categoryModel.findOne({ product_id: productId, category_id: categoryId });
        if (existingRole) {
            return res.status(409).json({ status: "Category already assigned to Product" });
        }

        const newProductCategory = new product_categoryModel({
            product_id: productId,
            category_id: categoryId
        });

        const result = await newProductCategory.save();
        console.log(result)
        res.status(201).json({ status: "Category added to Product successfully", result: result });
    } catch (error) {
        res.status(500).json({ status: "Failed to add Category to Product", error: error.message });
    }
};
