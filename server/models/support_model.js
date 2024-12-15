const db = require("../db/db");
const supportSchemma = new db.mongoose.Schema(
    {

        user_id: {
            type: db.mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        messages: [
            {
                sender: { type: String, enum: ["user", "admin"], required: true }, // Ai gửi (user/admin)
                content: { type: String, required: true }, // Nội dung tin nhắn
                createdAt: { type: Date, default: Date.now }, // Thời gian gửi
            },
        ]
    },
    {
        collection: "support",
        timestamps: true,
        versionKey: false
    }
);
const supportModel = db.mongoose.model("support", supportSchemma);
module.exports = { supportModel };
