const db = require("../db/db");
const review_productSchema = new db.mongoose.Schema(
  {

    review_id: {
        type: String,
        require: true
    },
    product_id: {
        type: String,
        require: true
    }
  },
  {
    collection: "review_product",
  }
);
const review_productModel = db.mongoose.model("review_productModel", review_productSchema);
module.exports = { review_productModel };

