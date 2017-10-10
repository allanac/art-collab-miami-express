const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const conversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
});



const ConversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = ConversationModel;
