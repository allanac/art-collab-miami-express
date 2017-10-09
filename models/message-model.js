const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({

  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});


const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
