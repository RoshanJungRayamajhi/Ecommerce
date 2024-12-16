const express = require("express")
const router = express.Router()
const { signup, singin, logout, getprofile,getproducts,productdetails, createOrder, verifyPayment } = require("../controller/userController")
const { isAuthenticated } = require("../middleware/authMiddleware")

// User registration route
router.post("/signup", signup)
router.post("/signin", singin)
router.post("/logout", logout)
router.get("/profile", isAuthenticated, getprofile)

router.get("/products",isAuthenticated,getproducts)
router.get("/product/:id",isAuthenticated,productdetails)

router.get("/order/:id",isAuthenticated,createOrder)
router.post("/verify/:id",isAuthenticated,verifyPayment)
module.exports = router
