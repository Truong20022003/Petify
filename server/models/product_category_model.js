const db = require("../db/db");
const product_categorySchema = new db.mongoose.Schema(
  {

    product_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product"
    },
    category_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "category"
    }
  },
  {
    collection: "product_category",
    timestamps: true,
    versionKey: false
  }
);
const product_categoryModel = db.mongoose.model("product_category", product_categorySchema);
module.exports = { product_categoryModel };

