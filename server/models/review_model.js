const db = require("../db/db");
const reviewSchema = new db.mongoose.Schema(
  {

    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        require: true
    },
    user_id: {
        type: String,
        require: true
    }
  },
  {
    collection: "review",
  }
);
const reviewModel = db.mongoose.model("reviewModel", reviewSchema);
module.exports = { reviewModel };

