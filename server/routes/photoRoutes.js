const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

// @route   GET api/photos
// @desc    Get all photos
// @access  Public
router.get('/', photoController.getPhotos);

// @route   POST api/photos
// @desc    Upload a photo
// @access  Public
router.post('/', (req, res) => {
  photoController.upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    photoController.uploadPhoto(req, res);
  });
});

module.exports = router;