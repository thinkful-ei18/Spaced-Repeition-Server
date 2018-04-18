'use strict';

const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  spanishWord:{ type:String },
  englishWord:{ type:String }
});


questionSchema.methods.serialize = function(){
  return{
    id: this._id,
    spanishWord: this.spanishWord ,
    englishWord: this.englishWord ,

  };
};

const Question = mongoose.model('Question',questionSchema);
module.exports = { Question };
