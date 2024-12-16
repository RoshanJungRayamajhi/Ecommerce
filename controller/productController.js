
const productModel = require("../model/productModel")
const cloudinary = require("../config/cloudinaryconfig")
const streamifier = require("streamifier")

module.exports.createProduct = async (req, res, next) => {

    try {
        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error); // Reject the promise if an error occurs
                    } else {
                        resolve(result.secure_url); // Resolve the promise with the secure URL
                    }
                });
    
                // Stream the file buffer to Cloudinary
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
        });
    
        // Wait for all files to finish uploading
        const uploadedUrls = await Promise.all(uploadPromises);
         const {name,price,description} = req.body
        if(!name || !price || !description){
            return res.status(400).json({message:"All fields are required"})
        }
        const product = await productModel.create({
            name,
            price,
            description,
            images: uploadedUrls,
            seller:req.user._id
        })
    
        // Respond with all uploaded URLs
        res.status(201).json({
            message: 'Files uploaded successfully in mongodb',
            urls: uploadedUrls,
            product,
            
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
    
}

