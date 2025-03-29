const Photo = require('../models/Photo');
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Initialize upload
exports.upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Get all photos
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ date: -1 });
    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Upload photo
exports.uploadPhoto = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const newPhoto = new Photo({
      name,
      description,
      imagePath: `/uploads/${req.file.filename}`
    });
    
    const savedPhoto = await newPhoto.save();
    res.json(savedPhoto);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};