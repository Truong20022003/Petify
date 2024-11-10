const db = require("../db/db");
const notificationUserSchema = new db.mongoose.Schema(
  {

    user_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    },
    notification_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "notification"
    }
  },
  {
    collection: "notification_user",
    timestamps: true, 
    versionKey: false 
  }
);
const notification_userModel = db.mongoose.model("notification_user", notificationUserSchema);
module.exports = { notification_userModel };

