const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },

    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment",

        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);
