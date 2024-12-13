const db = require("../db/db");
const invoiceSchema = new db.mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true
        },
        total: {
            type: Number,
            require: true
        },
        date: {
            type: String,
            require: true
        },
        status: {
            type: String,
            require: true
        },
        payment_method: {
            type: String,
            require: true
        },
        delivery_address: {
            type: String,
            require: true
        },
        shipping_fee: {
            type: String,
            require: true
        },
        carrier_id: {
            type: db.mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "carrier"
        },
        order_id: {
            type: db.mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "order"
        },
        code: {
            type: String,
            required: false
        },
        create_at: {
            type: String,
            require: true
        }
    },
    {
        collection: "invoice",
        timestamps: true,
        versionKey: false
    }
);
const invoiceModel = db.mongoose.model("invoice", invoiceSchema);
module.exports = { invoiceModel };

