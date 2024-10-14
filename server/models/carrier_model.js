const db = require("../db/db");
const carrierSchemma = new db.mongoose.Schema(
  {

    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        require: true
    }
    
  },
  {
    collection: "carrier",
  }
);
const carrierModel = db.mongoose.model("carrierModel", carrierSchemma);
module.exports = { carrierModel };

