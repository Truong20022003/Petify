const {cartModel} = require("../models/cart_model")

exports.addCart = async (req, res, next) => {
    try {
        console.log("Request body:", req.body);

        const existingCart = await cartModel.findOne({
            product_id: req.body.product_id,
            user_id: req.body.user_id
        });
        console.log("Existing cart result:", existingCart);

        if (existingCart) {
            return res.json({ status: "Sản phẩm đã có trong giỏ hàng", data: existingCart });
        }

        const obj = new cartModel({
            product_id: req.body.product_id,
            user_id: req.body.user_id,
            quantity: req.body.quantity
        });

        console.log("Saving new cart item:", obj);

        const result = await obj.save();
        console.log("Saved result:", result);

        res.json({ status: "Thêm vào giỏ hàng thành công", data: result });
    } catch (error) {
        console.error("Error adding cart:", error);
        res.json({ status: "Thêm vào giỏ hàng thất bại", error: error.message });
    }
};


exports.getCartByUserId = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        console.log(user_id)
        const cartItems = await cartModel.find({ user_id: user_id })
            .populate('product_id');

            res.json(cartItems);
        
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};



exports.updateQuantityInCart = async (req, res, next) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        if (!user_id || !product_id || typeof quantity !== 'number') {
            return res.status(400).json({
                status: "Invalid input",
                message: "user_id, product_id, and quantity are required"
            });
        }

        const updatedCart = await cartModel.findOneAndUpdate(
            { user_id: user_id, product_id: product_id },
            { $set: { quantity: quantity } },            
            { new: true }                                 
        );

       
        if (updatedCart) {
            res.json(updatedCart);
        } else {
            res.json({
                status: "Not found",
                message: "No cart item matches the criteria"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};
exports.deleteCartByProductIdAndUserId = async (req, res, next) => {
    try {
        const { product_id, user_id } = req.params;

        // Kiểm tra tham số
        if (!product_id || !user_id) {
            return res.status(400).json({
                status: "Invalid input",
                message: "Both product_id and user_id are required"
            });
        }

        // Tìm và xóa sản phẩm
        const result = await cartModel.findOneAndDelete({ product_id, user_id });

        if (result) {
            res.json({ status: "Xóa sản phẩm khỏi giỏ hành tha", data: result });
        } else {
            res.status(404).json({ status: "Not found", message: "Cart item not found" });
        }
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};

