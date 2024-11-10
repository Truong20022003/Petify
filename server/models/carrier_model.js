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
    timestamps: true, 
    versionKey: false 
  }
);
const carrierModel = db.mongoose.model("carrier", carrierSchemma);
module.exports = { carrierModel };

