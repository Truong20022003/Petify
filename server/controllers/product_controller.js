const { productModel } = require("../models/product_model")
const { invoice_detailModel } = require("../models/invoice_detail_model")
const { uploadToCloudinary } = require('../routes/uploads');
const cloudinary = require('cloudinary').v2;

const admin = require("../db/firebase_admin");
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}
const sendSaleUpdateNotification = async (productName, newSale) => {
    try {
        const message = {
            notification: {
                title: "Giảm giá sản phẩm",
                body: `Sản phẩm "${productName}" đang được giảm giá ${newSale} %!`,
            },
            topic: "sale_updates", 
        };

        await admin.messaging().send(message);
        console.log(`Notification sent for product: ${productName}`);
    } catch (error) {
        console.error("Error sending sale update notification:", error);
    }
};
const updateSalePrice = async (req, res) => {
    try {
        const { id } = req.params; // ID sản phẩm
        const { sale } = req.body; // Giá sale mới

        if (sale == null) {
            return res.status(400).json({ success: false, message: "Giá sale là bắt buộc." });
        }

        // Tìm sản phẩm theo ID
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
        }

        // Cập nhật giá sale nếu có thay đổi
        if (product.sale !== sale) {
            product.sale = sale;
            await product.save();

            // Gửi thông báo
            await sendSaleUpdateNotification(product.name, sale);
            return res.status(200).json({
                success: true,
                message: "Cập nhật giá sale thành công và thông báo đã được gửi.",
                product,
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Không có thay đổi về giá sale.",
                product,
            });
        }
    } catch (error) {
        console.error("Error updating sale price:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ.", error });
    }
};

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
        // Tải ảnh lên Cloudinary và lấy public_id và URL
        const uploadedImages = await Promise.all(req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'Petify_Images', // Thư mục lưu ảnh trên Cloudinary
                allowed_formats: ['jpg', 'jpeg', 'png']
            });

            // Trả về một đối tượng chứa public_id và URL của ảnh đã tải lên
            return {
                public_id: result.public_id,
                url: result.secure_url // URL của ảnh sau khi tải lên Cloudinary
            };
        }));

        console.log('Saving product to database...');

        // Lưu cả public_id và URL vào cơ sở dữ liệu
        const newProduct = {
            ...req.body,
            image: uploadedImages.map(img => img.url), // Lưu URL vào trường image
            image_id: uploadedImages.map(img => img.public_id) // Lưu public_id vào trường image_id
        };

        // Lưu sản phẩm vào cơ sở dữ liệu
        const product = await productModel.create(newProduct);

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
    try {
        const { id } = req.params;
        const { images } = req.body; // Danh sách URL ảnh hiện tại
        const image = req.files || []; // File ảnh mới

        // Lấy thông tin sản phẩm cũ từ database
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const currentImages = JSON.parse(images); // Danh sách URL ảnh từ client
        let currentImageIds = existingProduct.image_id; // Danh sách public_id cũ (Thay đổi từ const thành let)
        const currentImageUrls = existingProduct.image; // Danh sách URL ảnh cũ từ DB

        // Tìm các ảnh cũ không còn trong danh sách hiện tại
        const imagesToDelete = currentImageIds.filter(publicId => {
            const url = currentImageUrls.find(img => img.includes(publicId));
            return !currentImages.includes(url); // Tìm ảnh không còn trong danh sách hiện tại
        });

        // Xóa ảnh khỏi Cloudinary và xóa public_id tương ứng
        for (const publicId of imagesToDelete) {
            try {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted image: ${publicId}`);
                // Xóa public_id khỏi mảng image_id của sản phẩm
                currentImageIds = currentImageIds.filter(id => id !== publicId); // Sửa lại đây, dùng let thay vì const
            } catch (error) {
                console.error(`Error deleting image ${publicId}:`, error);
            }
        }

        // Xử lý thêm các ảnh mới
        for (const file of image) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "Petify_Images",
                allowed_formats: ["jpg", "jpeg", "png"],
            });

            currentImages.push(result.secure_url); // Thêm URL mới
            currentImageIds.push(result.public_id); // Thêm public_id mới
        }

        // Cập nhật thông tin sản phẩm
        const updatedProductData = {
            ...req.body,
            image: currentImages,
            image_id: currentImageIds,
        };

        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedProductData, {
            new: true,
        });

        return res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ success: false, message: "Error updating product", error });
    }
};






const deleteproduct = async (req, res, next) => {
    try {
        let id = req.params.id;
        const existingProduct = await productModel.findById(id);

        if (!existingProduct) {
            return res.status(404).json({
                status: "failed",
                message: "Không tìm thấy sản phẩm."
            });
        }

        // Kiểm tra xem sản phẩm có ảnh hay không
        const imageIds = existingProduct.image_id || [];

        // Xóa ảnh từ Cloudinary
        for (const publicId of imageIds) {
            try {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted image from Cloudinary: ${publicId}`);
            } catch (error) {
                console.error(`Error deleting image ${publicId}:`, error);
            }
        }

        // Kiểm tra nếu sản phẩm tồn tại trong hóa đơn
        const existingInvoiceDetails = await invoice_detailModel.findOne({ productId: id });

        if (existingInvoiceDetails) {
            return res.status(400).json({
                status: "failed",
                message: "Không thể xóa sản phẩm. Sản phẩm tồn tại trong chi tiết hóa đơn."
            });
        }

        // Xóa sản phẩm trong database
        let result = await productModel.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({
                status: "failed",
                message: "Không tìm thấy sản phẩm."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Sản phẩm đã xóa thành công.",
            result: result
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ nội bộ.",
            error: error.message
        });
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
    updateSalePrice
};