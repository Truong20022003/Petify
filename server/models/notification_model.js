const db = require("../db/db");
const notificationSchema = new db.mongoose.Schema(
  {

    order_date: {
        type: String,
        required: true
    },
    total_price: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    }
  },
  {
    collection: "notification",
  }
);
const notificationModel = db.mongoose.model("notificationModel", notificationSchema);
module.exports = { notificationModel };

