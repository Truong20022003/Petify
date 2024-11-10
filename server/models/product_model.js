const db = require("../db/db");
const productSchema = new db.mongoose.Schema(
  {

    supplier_id: {
        type: db.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "supplier"
    },
    price: {
        type: Number,
        require: true
    },
    date: {
        type: String,
        required: true
    },
    expiry_Date: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sale: {
        type: Number,
        required: true
    }
  },
  {
    collection: "product",
    timestamps: true, 
    versionKey: false 
  }
);
const productModel = db.mongoose.model("product", productSchema);
module.exports = { productModel };

