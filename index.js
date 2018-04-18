'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const { router: authRouter, localStrategy, jwtStrategy  } = require('./auth');
const { router:usersRouter } = require('./routes/users.js');
const { router:questionRouter } = require('./routes/questions.js');

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

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
// move past jwtAuth after seeding on live.
app.use('/api/questions', questionRouter);
const jwtAuth = passport.authenticate('jwt', { session:false});

//sanity test delete me after development
app.get('/api/dashboard', jwtAuth, (req, res) => {
  return res.json({
    data: 'we will learn Spanish!'
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
