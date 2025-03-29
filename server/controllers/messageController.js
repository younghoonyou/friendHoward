const Message = require('../models/Message');

// Get all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add new message
exports.addMessage = async (req, res) => {
  try {
    const { name, message } = req.body;
    
    const newMessage = new Message({
      name,
      message
    });
    
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};