const db = require("../db/db");
const supplierSchema = new db.mongoose.Schema(
  {

    name: {
      type: String,
      require: true
    },
    description: {
      type: String,
      require: true
    },
    phone_number: {
      type: String,
      require: true
    }
  },
  {
    collection: "supplier",
    timestamps: true,
    versionKey: false
  }
);
const supplierModel = db.mongoose.model("supplier", supplierSchema);
module.exports = { supplierModel };

