const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://team10diem:team10diem@cluster0.gb3fb.mongodb.net/petify").then(() => {
    console.log("server connect successfully")

}).catch((error) => {
    console.log("server connect failed" + error)
})
module.exports = mongoose;