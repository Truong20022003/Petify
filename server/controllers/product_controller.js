const { productModel } = require("../models/product_model")

const fs = require('fs');
const { uploadToCloudinary } = require('../routes/uploads');
const getListproduct = async (req, res, next) => {
    try {
        let listproduct = await productModel.find({});
        res.json(listproduct);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};

const addproduct = async (req, res) => {
    console.log("Files received in addproduct:", req.files);

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    try {
        const uploadedImages = req.files.map(file => file.path); // Lấy URL ảnh từ Cloudinary

        console.log('Saving product to database...');
        const newProduct = {
            ...req.body,
            image: uploadedImages
        };

        // Lưu sản phẩm vào cơ sở dữ liệu
        const product = await productModel.create(newProduct);

        // Trả về sản phẩm cùng với id (lấy _id của Mongoose)
        const responseProduct = {
            id: product._id, // Thêm trường id vào kết quả
            ...product.toObject(), // Lấy tất cả thông tin sản phẩm
        };

        console.log('Sending response...');
        return res.status(200).json({ success: true, product: responseProduct });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ success: false, message: 'Error uploading files', error });
    }
};


const updateproduct = async (req, res) => {
    console.log("Files received in updateproduct:", req.files);

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    try {
        const uploadedImages = req.files.map(file => file.path); // Lấy URL ảnh từ file upload

        console.log('Updating product in database...');
        const updatedProduct = {
            ...req.body,
            image: uploadedImages
        };

        // Cập nhật sản phẩm trong cơ sở dữ liệu
        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            updatedProduct,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Tạo response giống addproduct
        const responseProduct = {
            id: product._id, // Thêm trường id vào kết quả
            ...product.toObject(), // Lấy tất cả thông tin sản phẩm
        };

        console.log('Sending response...');
        return res.status(200).json({ success: true, product: responseProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Error updating product', error });
    }
};



const deleteproduct = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await productModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

const getproduct = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await productModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

const getproductById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await productModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
module.exports = {
    addproduct,
    updateproduct,
    getListproduct,
    deleteproduct,
    getproductById,
};