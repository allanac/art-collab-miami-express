const express = require('express');
const UserModel = require('../models/user-model.js');
const ConversationModel  = require('../models/conversation-model.js');
const MessageModel = require('../models/message-model.js');

const router = express.Router();


// GET /api/messages
router.get('/messages', (req, res, next) => {
  console.log('Check getting conversations');
  // This route will display all conversations the signed in user has with other users
  // Only return one message from each conversation to display as snippet
  ConversationModel.find({ participants: req.user._id })
    .select('_id participants')
    .populate({
      path: "participants",
      select: "name"
    })
    .exec((err, conversations) => {
        if (err) {
          res.status(500).json({errorMessage: 'Error finfinf conversations'});
          return;
          }

      // Set up empty array to hold conversations + most recent message
    let fullConversations = [];
    conversations.forEach((conversation) => {
      console.log('convo--------')
      console.log(conversation);
      if (req.user._id.toString() === conversation.participants[0]._id.toString()) {
        var recipient = conversation.participants[1];
      }
      else{
        var recipient = conversation.participants[0];
      }
      console.log(recipient);

      MessageModel.findOne({ 'conversationId': conversation._id })
          .sort('-createdAt')
          .exec((err, message) => {
            if (err) {
              res.status(500).json({errorMessage: 'Error finding messages!'});
              return;
            }
            if (message){
              message.recipient = recipient;
            }

            fullConversations.push(message);
            if(fullConversations.length === conversations.length)
              {
              res.locals.conversationList = fullConversations;
              res.status(200).json(fullConversations);
              }
          });
      });
  });
});


// GET /api/messages/:recipient
router.get('/messages/:recipient', (req, res, next) => {
  // This route will display the specific messages with logged in user and other user
  ConversationModel.findOne(
    {participants:
        { $size: 2, $all:[req.user._id, req.params.recipient] }
      },

      (err, conversation) => {
        if(conversation === null){
          const newConversation = new ConversationModel (
            {
              participants: [
                req.user._id,
                req.params.recipient]
            }
          );

          newConversation.save((err) =>  {
            if (err) {
              res.status(500).json({ errorMessage: 'Error saving user.'});
              return;
            }
            res.locals.MessagesList = [];
            res.status(200).json(newConversation);
          })
        }

        else {
          MessageModel.find({ conversationId: conversation._id })
            .select('createdAt body author')
            .sort('-createdAt')
            .populate({
              path: 'author',
              select: 'name'
            })
            .exec((err, messages) => {
              if (err) {
                res.status(500).json({errorMessage: 'Error finding messages'});
                return;
                }
                res.locals.recipient = req.params.recipient;
                res.locals.MessagesList = messages;

                res.status(200).json(messages);
            });
        }
      }
  )
});

// POST /api/messages/:recipient/chat
router.post('/messages/:recipient/chat', (req, res, next) => {
  ConversationModel.findOne(
    {participants:
        { $size: 2, $all:[req.user._id, req.params.recipient] }
      },

      (err, conversation) => {
        if (err) {
          res.status(500).json({errorMessage: 'Error finding conversation'});
          return;
        }

        if(conversation){
          sendMessage(req, res, next, conversation);
        }
        else {
          const newConversation = new ConversationModel (
            {
              participants: [
                req.user._id,
                req.params.recipient]
            }
          );

          newConversation.save((err) =>  {
            if (err) {
              res.status(500).json({errorMessage: 'Error saving new conversation'});
            }

            sendMessage(req, res, next, newConversation);
          })
        } // close else {
      } // close (err, conversation) => {
    ); // close   ConversationModel.findOne(
});


// function sendMessage (req, res, next, conversation) {
//   const message = new MessageModel({
//     conversationId: conversation._id,
//     body: req.body.composedMessage,
//     author: req.user._id
//   });
//
//   message.save((err, sentReply) => {
//     if (err) {
//       next(err);
//       return;
//     }
//
//     res.redirect('/messages/' + req.params.recipient);
//   });
// }
//
//
//
// // DELETE Route to Delete Conversation
// router.get(deleteConversation = function(req, res, next) {
//   Conversation.findOneAndRemove({
//     $and : [
//             { '_id': req.params.conversationId }, { 'participants': req.user._id }
//            ]}, function(err) {
//         if (err) {
//           res.send({ error: err });
//           return next(err);
//         }
//
//         res.status(200).json({ message: 'Conversation removed!' });
//         return next();
//   });
// }





module.exports = router;
