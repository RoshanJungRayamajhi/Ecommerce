const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
       
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    price: {
        type: Number,
       required:true
    },
    images:[{
        type:String,
    }],
     seller: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
  
},{timestamps:true})

module.exports = mongoose.model("product", productSchema)
