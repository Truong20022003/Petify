const {productModel} = require("../models/product_model")

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
      const imageUrls = [];

      for (const file of req.files) {
          const filePath = file.path;
          const result = await uploadToCloudinary(filePath);
          imageUrls.push(result.secure_url); 

          fs.unlinkSync(filePath);
      }

      const newProduct = {
          ...req.body,
          image: imageUrls
      };

      await productModel.create(newProduct);

      res.json({ success: true, product: newProduct });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ success: false, message: 'Error uploading files', error });
  }
};


const updateproduct = async (req, res) => {
  if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  try {
      const imageUrls = [];

      for (const file of req.files) {
          const filePath = file.path;
          const result = await uploadToCloudinary(filePath);
          imageUrls.push(result.secure_url); 

          fs.unlinkSync(filePath);
      }

      const updatedProduct = {
          ...req.body,
          image: imageUrls 
      };

      const product = await productModel.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });

      res.json({ success: true, product });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ success: false, message: 'Error uploading files', error });
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