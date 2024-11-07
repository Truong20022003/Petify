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
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    }
  },
  {
    collection: "review",
    timestamps: true, 
    versionKey: false 
  }
);
const reviewModel = db.mongoose.model("reviewModel", reviewSchema);
module.exports = { reviewModel };

