const db = require("../db/db");
const product_categorySchema = new db.mongoose.Schema(
  {

   product_id: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        require: true
    }
  },
  {
    collection: "product_category",
  }
);
const product_categoryModel = db.mongoose.model("product_categoryModel", product_categorySchema);
module.exports = { product_categoryModel };

