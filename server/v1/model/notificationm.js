const supabase = require('../supaBaseClient.js');
const createNotification = async({ senderId, receiverId, message, link }) => {
    return await supabase
        .from('notifications')
        .insert({
            sender_id: senderId,
            receiver_id: receiverId,
            message,
            link
        });
}
module.exports = createNotification;
