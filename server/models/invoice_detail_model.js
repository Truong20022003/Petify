const db = require("../db/db");
const invoiceDetailSchema = new db.mongoose.Schema(
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
    invoice_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "invoice"
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
    collection: "invoice_detail",
    timestamps: true,
    versionKey: false
  }
);
const invoice_detailModel = db.mongoose.model("invoiceDetail", invoiceDetailSchema);
module.exports = { invoice_detailModel };

