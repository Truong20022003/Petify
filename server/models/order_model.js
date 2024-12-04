const db = require("../db/db");
const orderSchema = new db.mongoose.Schema(
  {

    user_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    },
    oder_date: {
      type: String,
      require: true
    },
    total_price: {
      type: Number,
      require: true
    },
    status: {
      type: String,
      require: true
    },
    payment_method: {
      type: String,
      require: true
    },
    delivery_address: {
      type: String,
      require: true
    },
    shipping_fee: {
      type: String,
      require: true
    },
    carrier_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "carrier"
    },
    code: {
      type: String,
      required: true
    }
  },
  {
    collection: "order",
    timestamps: true,
    versionKey: false
  }
);
const orderModel = db.mongoose.model("order", orderSchema);
module.exports = { orderModel };

