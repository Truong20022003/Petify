const db = require("../db/db");
const user_roleSchema = new db.mongoose.Schema(
  {

    user_id: {
        type: String,
        require: true
    },
    role_id: {
        type: String,
        require: true
    }
  },
  {
    collection: "user_role",
  }
);
const user_roleModel = db.mongoose.model("user_roleModel", user_roleSchema);
module.exports = { user_roleModel };

