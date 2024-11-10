const db = require("../db/db");
const userSchema = new db.mongoose.Schema(
  {

    name: {
        type: String,
        require: false
    },
    
    email: {
        type: String,
        require: true
    },
    
    phone_number: {
        type: String,
        require: false
    },
    
    password: {
        type: String,
        require: true
    },
    
    user_name: {
        type: String,
        require: false
    },
    
    location: {
        type: String,
        require: false
    },
    
    avata: {
        type: String,
        require: false
    },
  },
  {
    collection: "user",
    timestamps: true, 
    versionKey: false 
  }
);
const userModel = db.mongoose.model("user", userSchema);
module.exports = { userModel };

