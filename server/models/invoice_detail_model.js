const db = require("../db/db");
const invoiceDetailSchema = new db.mongoose.Schema(
  {

    user_id: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        require: true
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
const invoice_detailModel = db.mongoose.model("invoiceDetailModel", invoiceDetailSchema);
module.exports = { invoice_detailModel };

