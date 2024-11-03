const db = require("../db/db");
const categorySchema = new db.mongoose.Schema(
  {

    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        require: true
    }
    
  },
  {
    collection: "category",
    timestamps: true, 
    versionKey: false 
  }
);
const categoryModel = db.mongoose.model("categoryModel", categorySchema);
module.exports = { categoryModel };

