const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaSchema = new Schema (
  {
    title: {type:String, required: [true, 'Please enter a title']},
    team: {type:String, required: [false, 'Did you work with any other artists you\'d like to include'] },
    status: {type:String, enum: ['Complete', 'Incomplete'], required: false},
    mediaFile: {type:String, required: [true, 'Please Upload Media']},
    category: {type: Array, required: [true, 'Please Select Category']},
    owner: {type:Schema.Types.ObjectId, ref: 'User', required: true},
    likes: [{type:Schema.Types.ObjectId, ref: 'User', required: false}]
  },
  {timestamps: true}
);

const MediaModel = mongoose.model('Media', mediaSchema);

module.exports = MediaModel;
