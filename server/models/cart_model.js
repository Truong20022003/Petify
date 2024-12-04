const db = require("../db/db");
const cartSchemma = new db.mongoose.Schema(
  {

    product_id: {
        type: db.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product"
      },
      user_id: {
        type: db.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
      },
    quantity: {
        type: Number,
        require: true
    }
  },
  {
    collection: "cart",
    timestamps: true, 
    versionKey: false 
  }
);
const cartModel = db.mongoose.model("cart", cartSchemma);
module.exports = { cartModel };

