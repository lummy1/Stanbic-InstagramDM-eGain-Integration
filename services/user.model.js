const  mongoose = require("mongoose");
//const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required',
  },
  type: {
    type: String,
   
  },
  token: {
    type: String,
   
  },
  basicAuth: {
    type: Object,
   
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  

});


//module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('User', UserSchema);
