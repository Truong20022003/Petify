const {cartModel} = require("../models/cart_model")

exports.addCart = async (req, res, next) => {
    try {
        const existingCart = await cartModel.findOne({
            product_id: req.body.product_id,
            user_id: req.body.user_id
        });

        if (existingCart) {
            return res.json({ status: "Product already in cart" });
        }
        let obj = new cartModel({
            product_id: req.body.product_id,
            user_id: req.body.user_id,
            quantity: req.body.quantity
        })
        let result = await obj.save();
        res.json(result);
    } catch (error) {
        res.json({status: "Add failed" })
    }
}
exports.getCartByUserId = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        console.log(user_id)
        const cartItems = await cartModel.find({ user_id: user_id })
            .populate('product_id');

            console.log(cartItems)
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

        const result = await cartModel.findOneAndDelete({ product_id: product_id, user_id: user_id });

        if (result) {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};
