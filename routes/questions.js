'use strict';
const express = require('express');
const { Question } = require('../models/questions.js');
const { User } = require('../models/users.js');
const seedData = require('../mockData/mockWords.json');
const passport = require('passport');

const router = express.Router();

// seeding the database !
router.get('/seed', (req, res) => {
  return Question.insertMany(seedData)
    .then(() => {
      return res.status(200);
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

const jwtAuth = passport.authenticate('jwt', { session:false});

router.get('/', jwtAuth, (req, res, next) => {
  User.findById(req.user.id)
    .select('questions')
    .then((result) => {
      return res.json(result.questions.head.data.wordPair);
    });
});

router.get('/correct', jwtAuth, (req, res, next) => {
  User.findById(req.user.id)
    .select('questions')
    .then((result) =>{
      console.log(result, 'onFind');
      console.log(result.questions.head.data.mValue,'dis is the m value');
      return res.json('testing');
    })

})
router.get('/wrong', (req, res, next)=>{

})
module.exports = { router };
