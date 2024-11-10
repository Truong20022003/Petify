const db = require("../db/db");
const user_roleSchema = new db.mongoose.Schema(
  {

    user_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user"
    },
    role_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "role"
    }
  },
  {
    collection: "user_role",
    timestamps: true, 
    versionKey: false 
  }
);
const user_roleModel = db.mongoose.model("user_roleM", user_roleSchema);
module.exports = { user_roleModel };

