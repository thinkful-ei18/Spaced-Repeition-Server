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
  }
});

userSchema.methods.validatePassword = function (password){
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPasword = function (password){
  return bcrypt.hash(password,10);
};

userSchema.methods.serialize = function(){
  return{
    username: this.username || '',
  };
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
