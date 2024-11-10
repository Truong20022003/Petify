const db = require("../db/db");
const review_productSchema = new db.mongoose.Schema(
  {

    review_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "review"
    },
    product_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product"
    }
  },
  {
    collection: "review_product",
    timestamps: true, 
    versionKey: false 
  }
);
const review_productModel = db.mongoose.model("review_product", review_productSchema);
module.exports = { review_productModel };

