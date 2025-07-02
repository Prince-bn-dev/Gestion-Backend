const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profil',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => req.body.nom, 
  },
});

const upload = multer({ storage });

module.exports = upload.single('file');
