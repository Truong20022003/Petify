const {favoritesModel} = require("../models/favotites_model")


exports.addFavorites = async (req, res, next) => {
    try {
        let obj = new favoritesModel({
            product_id: req.body.product_id,
            user_id: req.body.user_id,
        });



        let result = await obj.save();
        res.json(result);
    } catch (error) {
        res.json({ status: "Add failed", message: error.message });
    }
};

exports.getFavoritesByUserId = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        const favoriteItems = await favoritesModel.find({ user_id: user_id })
            .populate('product_id'); // Populate thông tin sản phẩm từ productModel

        if (favoriteItems && favoriteItems.length > 0) {
            res.json(favoriteItems);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};

exports.deleteFavoriteByProductIdAndUserId = async (req, res, next) => {
    try {
        const { product_id, user_id } = req.params;

        // Kiểm tra nếu các tham số hợp lệ
        if (!product_id || !user_id) {
            return res.status(400).json({ status: "Error", message: "Product ID and User ID are required" });
        }

        // Xóa mục yêu thích từ cơ sở dữ liệu
        const result = await favoritesModel.findOneAndDelete({ product_id: product_id, user_id: user_id });

        if (result) {
            // Thành công: trả về dữ liệu xóa
            res.json({ status: "Success", message: "Favorite item deleted successfully", data: result });
        } else {
            // Không tìm thấy mục yêu thích: trả về thông báo
            res.status(404).json({ status: "Not found", message: "No favorite item found for the given product and user" });
        }
    } catch (error) {
        // Lỗi máy chủ: trả về lỗi với mã trạng thái 500
        console.error("Error deleting favorite:", error); // Log lỗi chi tiết
        res.status(500).json({ status: "Error", message: error.message });
    }
};

