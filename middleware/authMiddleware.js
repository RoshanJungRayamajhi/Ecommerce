const userModel = require("../model/userModel")
const blacklistedTokenModel = require("../model/blacklistModel")
const jwt = require("jsonwebtoken")

module.exports.isAuthenticated = async (req, res, next) => {
   try {
    const token = req.headers.authorization.split(" ")[1]
    const isBlacklisted = await blacklistedTokenModel.findOne({token})
    if(isBlacklisted) return res.status(401).json({message:"Unauthorized"})
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded._id)
    if(!user) return res.status(401).json({message:"Unauthorized"})

    req.user = user
    next()
   } catch (error) {
    res.status(500).json({message:"Internal server error"})
    next(error)
    
   }
}
module.exports.isSeller = async (req, res, next) => {
    const user = req.user
    if(user.role !== "seller") return res.status(401).json({message:"Unauthorized"})
    next()
}
