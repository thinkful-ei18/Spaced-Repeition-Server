'use strict';

const mongoose = require('mongoose');

// simple
const questionScheema = mongoose.Scheema({
  spanishWord:{ type:String },
  englishWord:{ type:String }
});


questionScheema.methods.serialize = function(){
  return{
    id: this._id,
    spanishWord: this.spanishWord ,
    englishWord: this.englishWord ,

  };
};

const Question = mongoose.model('Question',questionScheema);
module.exports = Question;
