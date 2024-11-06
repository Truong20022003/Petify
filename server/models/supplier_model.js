const db = require("../db/db");
const supplierSchema = new db.mongoose.Schema(
  {

    name: {
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
const supplierModel = db.mongoose.model("supplierModel", supplierSchema);
module.exports = { supplierModel };

