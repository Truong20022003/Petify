const db = require("../db/db");
const orderSchema = new db.mongoose.Schema(
  {

    user_id: {
        type: String,
        required: true
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
  },
  {
    collection: "order",
  }
);
const orderModel = db.mongoose.model("orderModel", orderSchema);
module.exports = { orderModel };

