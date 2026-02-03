const createNotification  = require('../model/notificationm.js');
const sendNotification = async(req, res) => {
  try {
    const { senderId, receiverId, message, link } = req.body;
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const { error } = await createNotification({ senderId, receiverId, message, link });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ success: true, message: 'Notification sent!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = sendNotification;