const express = require("express")
const router = express.Router()
const {isAuthenticated, isSeller} = require("../middleware/authMiddleware")
const {createProduct} = require("../controller/productController")


const productModel = require("../model/productModel")
const upload = require("../config/multerConfig")
const cloudinary = require("../config/cloudinaryconfig")

router.post("/create",isAuthenticated,isSeller,upload.any(),createProduct)



module.exports = router;
