const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dvsxr7wn0', 
    api_key: '192282248827552', 
    api_secret: 'owmRWp0O11ufzp2rJ3qyKacnol0' // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;
