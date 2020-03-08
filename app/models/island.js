'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;



const islandSchema = new Schema({
  name: String,
  description: String,
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  category:  {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  image: String
});

module.exports = Mongoose.model('Island', islandSchema);