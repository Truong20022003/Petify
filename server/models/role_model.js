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
    timestamps: true, 
    versionKey: false 
  }
);
const roleModel = db.mongoose.model("role", roleSchema);
module.exports = { roleModel };

