'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  password:{
    type: String,
    required: true
  },
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  questions:[{}]
  // questions:[{spanish,english,mvalue,next}]
});
  //populate
// user.questions.english = questions.english
//user.questions.spanish = questions.spanish
userSchema.methods.validatePassword = function (password){
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPasword = function (password){
  return bcrypt.hash(password,10);
};

userSchema.methods.serialize = function(){
  return{
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

// userSchema.methods.questionRight = function(){
//   // moves question into list deep
// };
//
// userSchema.methods.questionWrong = function(){
//   // moves question into list once.
// };

const User = mongoose.model('User', userSchema);
module.exports = { User };
