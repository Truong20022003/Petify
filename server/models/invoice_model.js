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
            type: String,
            require: true
        },
        order_id: {
            type: String,
            require: true
        }
    },
    {
        collection: "invoice",
    }
);
const invoiceModel = db.mongoose.model("invoiceModel", invoiceSchema);
module.exports = { invoiceModel };

