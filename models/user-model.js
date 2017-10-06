const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {type: String, required:[true,'Username is required']},
    encryptedPassword: {type: String, required:[true, 'Password is required']},
    fullName:{type:String, required: false},
    userPic:{type:String, required: false},
    genre: {type:Array, required:false},
    artForm: {type:String, required:false},
    artTools: {type:[String] , required: false},
    collabStyle: {type:String, required:false},
    bio: {type:String, required:false},
    media: [{type: Schema.Types.ObjectId, ref: 'Media', required:false}],
    events: [{type: Schema.Types.ObjectId, ref: 'Event', required:false}],
  },
    {timestamps:{createdAt:'created_at', updatedAt:'updated_at'} }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
