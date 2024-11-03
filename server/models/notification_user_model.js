const db = require("../db/db");
const notificationUserSchema = new db.mongoose.Schema(
  {

    user_id: {
        type: String,
        required: true
    },
    notification_id: {
        type: String,
        require: true
    }
  },
  {
    collection: "notification_user",
    timestamps: true, 
    versionKey: false 
  }
);
const notification_userModel = db.mongoose.model("notification_userModel", notificationUserSchema);
module.exports = { notification_userModel };

