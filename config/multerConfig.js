const multer = require("multer")

// Configure multer to use memory storage
const storage = multer.memoryStorage()

// Create multer upload instance with memory storage
const upload = multer({
    storage: storage,
})

module.exports = upload
