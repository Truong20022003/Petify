const db = require("../db/db");
const orderDetailSchema = new db.mongoose.Schema(
  {
    user_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "user"
    },
    product_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product"
    },
    order_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "order"
    },
    quantity: {
        type: Number,
        require: true
    },
    total_price: {
        type: Number,
        require: true
    }
    
  },
  {
    collection: "order_detail",
    timestamps: true, 
    versionKey: false 
  }
);
const order_detailModel = db.mongoose.model("orderDetail", orderDetailSchema);
module.exports = { order_detailModel };

