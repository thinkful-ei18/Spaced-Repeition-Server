'use strict';
const express = require('express');
const Question = require('./model.js');
const seedData = require('../mockData/mockWords.json');

const router = express.Router();

// router.get('/seed', (req, res) => {
//   return Question.insertMany(seedData)
//     .then(() => {
//       return res.status(200);
//     })
//     .catch(err => {
//       res.status(500).json({ code: 500, message: 'Internal server error' });
//     });
// });

router.get('/', (req, res, next) => {
  Question.find({})
    .then(questions => {
      res.json(questions);
    })
    .catch(next);
});
module.exports = { router };
