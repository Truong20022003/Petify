const db = require("../db/db");
const roleSchema = new db.mongoose.Schema(
  {

    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
  },
  {
    collection: "role",
  }
);
const roleModel = db.mongoose.model("roleModel", roleSchema);
module.exports = { roleModel };

