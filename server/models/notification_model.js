const db = require("../db/db");
const notificationSchema = new db.mongoose.Schema(
  {

    order_date: {
        type: String,
        required: true
    },
    total_price: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    }
  },
  {
    collection: "notification",
    timestamps: true, 
    versionKey: false 
  }
);
const notificationModel = db.mongoose.model("notification", notificationSchema);
module.exports = { notificationModel };

