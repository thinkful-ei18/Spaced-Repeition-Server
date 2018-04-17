'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy  } = require('./auth');
const { router: questionRouter} = require('./questions');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
// move me down, un auth for development purpouses.
app.use('/api/questions', questionRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

const jwtAuth = passport.authenticate('jwt', { session:false});

app.get('/api/dashboard', jwtAuth, (req, res) => {
  return res.json({
    data: 'we will learn Spanish!'
  });
});
//move to module
const {User} = require('./users/models.js');
app.get('/api/dash/question', jwtAuth, (req, res, next) => {
  console.log(req.user,'test');
  User.findById(req.user.id)
    .select('questions')
    .then((questions) => {
      console.log(questions.questions[0]);
      res.json(questions.questions[0]);
    });

});

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
