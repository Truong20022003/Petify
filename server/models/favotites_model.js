const db = require("../db/db");
const favoritesSchemma = new db.mongoose.Schema(
  {

    product_id: {
        type: db.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product"
      },
      user_id: {
        type: db.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
      }
  },
  {
    collection: "favorites",
    timestamps: true, 
    versionKey: false 
  }
);
const favoritesModel = db.mongoose.model("favorites", favoritesSchemma);
module.exports = { favoritesModel };

