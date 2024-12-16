const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"order",
        required:true
        
    },
    paymentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"payment",
        required:true
    },
    signature:{
        type:String,
        required:true
    }
    ,
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("payment", paymentSchema);
