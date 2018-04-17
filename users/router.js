'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { User } = require('./models');
const { Question }  = require('../questions/model.js');
console.log(typeof Question,'==');
const router = express.Router();

const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reqson: 'ValidationError',
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
      reqson: 'ValidationError',
      message: 'Incorrect Type',
      location: nonStringField,
    });
  }

  const explicitTrimmedFields = ['username', 'password'];
  const nonTrimmedFeild = explicitTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedFeild) {
    return res.status(422).json({
      code: 422,
      reqson: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedFeild,
    });
  }

  let { username, password, firstName, lastName } = req.body;
  // let questions = Question.find();
  // console.log(questions,'questions');
  let temp ;
  return User.find({ username })
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
      return Promise.all([User.hashPasword(password),Question.find({})]);
    })
    .then((hash, questions) => {
      // res.json(questions)

      return User.create({
        username,
        password: hash,
        lastName,
        firstName
        // questions
      });
    })

    .then(user => {
      return res.status(201).json(user.serialize());
    })

    //do populate here
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

module.exports = { router };
