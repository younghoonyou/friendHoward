const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// @route   GET api/messages
// @desc    Get all messages
// @access  Public
router.get('/', messageController.getMessages);

// @route   POST api/messages
// @desc    Add a message
// @access  Public
router.post('/', messageController.addMessage);

module.exports = router;