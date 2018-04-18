'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { User } = require('../models/users.js');
const { Question }  = require('../models/questions.js');
const LinkedList = require('../linkedList/linkedList.js');


const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'MissingField',
      location: missingField,
    });
  }

  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect Type',
      location: nonStringField,
    });
  }

  const explicitTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicitTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if ( nonTrimmedField ) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField,
    });
  }

  let { username, password, firstName, lastName } = req.body;
    let QuestionsSLL = new LinkedList();
    return Question.find()
    .then(questions => {
        questions.forEach((question) =>{
          QuestionsSLL.insertLast({
               wordPair:{
                   "englishWord":question.englishWord,
                   "spanishWord":question.spanishWord
               },
               mValue:1
           })
       })
    })
    .then(() =>{
      User.find({ username })
        .count()
        .then(count => {
          if (count > 0) {
            return Promise.reject({
              code: 422,
              reason: 'ValidationError',
              message: 'Username taken',
              location: 'username',
            });
          }
        })
    })
    .then(() => {
        return User.hashPassword(password)
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        lastName,
        firstName,
        questions:QuestionsSLL
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {;
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

module.exports = { router };
