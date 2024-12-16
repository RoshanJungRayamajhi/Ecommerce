const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const blacklistModel = require("../model/blacklistModel")
const productModel = require("../model/productModel")
const paymentModel = require("../model/paymentModel")
const orderModel = require("../model/orderModel")
require("dotenv").config()

const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const isavailableuser = await userModel.findOne({ email })
        if (isavailableuser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        })
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(201).json({ message: "User created successfully",
             user,
             token
             })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
module.exports.singin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found sinup first" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ message: "User logged in successfully", user, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })

    }
}
module.exports.logout = async (req, res, next) => {
        const token = req.headers.authorization.split(" ")[1]
        if(!token){
            return res.status(400).json({message:"Token is required"})
        }
        const isTokenBlacklisted = await blacklistModel.findOne({token})
        if(isTokenBlacklisted){
            return res.status(400).json({message:"Token is already blacklisted"})
        }
        await blacklistModel.create({token})
        res.status(200).json({message:"User logged out successfully"})
}
module.exports.getprofile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        res.status(200).json({message:"User profile fetched successfully", user})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports.getproducts = async (req, res, next) => {
   try {
    const products = await productModel.find()
    res.status(200).json({message:"Products fetched successfully",products})
   } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal server error"})
   }
}

module.exports.productdetails = async (req,res,next)=>{
    try {
        const product = await productModel.findById(req.params.id)
        if(!product){
            return res.status(400).json({message:"Product not found"})
        }
        res.status(200).json({message:"Product details fetched successfully",product})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports.createOrder = async (req,res,next)=>{
    try {
        const product = await productModel.findById(req.params.id)
        if(!product){
            return res.status(400).json({message:"Product not found"})
        }
       const options = {
        amount: product.amount *100,
        currency:"INR",
        receipt:product._id,
       }
       const  order = await instance.orders.create(options)
       res.status(200).json({message:"Order created successfully",order})

       const payment = await paymentModel.create({
        orderId:order.id,
        amount:product.amount,
        currency:"INR",
        status:"pending",
       

       })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports.verifyPayment = async (req,res,next)=>{
    try {
        const {paymentId,orderId,signature} = req.body
        const secret = process.env.RAZORPAY_KEY_SECRET
        const { validatePaymentVerification}= require("../node_modules/razorpay/dist/utils/razorpay-utils.js")
        const isValid = validatePaymentVerification({payment_id:paymentId,order_id:orderId},signature,secret)
        if(isValid){
            const payment = await paymentModel.findOne({
                orderId:orderId
            })
            payment.status = "completed"
            payment.paymentId = paymentId
            payment.signature = signature
            await payment.save()
            res.status(200).json({message:"Payment verified successfully",payment})
        }else{
            const payment = await paymentModel.findOne({
                orderId:orderId
            })
            payment.status = "failed"
            await payment.save()
            res.status(400).json({message:"Payment verification failed"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}
