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
  },
  {
    collection: "order",
    timestamps: true, 
    versionKey: false 
  }
);
const orderModel = db.mongoose.model("order", orderSchema);
module.exports = { orderModel };

