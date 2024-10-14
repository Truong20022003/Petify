const db = require("../db/db");
const userSchema = new db.mongoose.Schema(
  {

    name: {
        type: String,
        require: true
    },
    
    email: {
        type: String,
        require: true
    },
    
    phone_number: {
        type: String,
        require: true
    },
    
    password: {
        type: String,
        require: true
    },
    
    user_name: {
        type: String,
        require: true
    },
    
    location: {
        type: String,
        require: true
    },
    
    avata: {
        type: String,
        require: true
    },
  },
  {
    collection: "user",
  }
);
const userModel = db.mongoose.model("userModel", userSchema);
module.exports = { userModel };

