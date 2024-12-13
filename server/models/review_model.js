const db = require("../db/db");
const reviewSchema = new db.mongoose.Schema(
  {

    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        require: false
    },
    user_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    },
    product_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product"
    }
  },
  {
    collection: "review",
    timestamps: true, 
    versionKey: false 
  }
);
const reviewModel = db.mongoose.model("review", reviewSchema);
module.exports = { reviewModel };

