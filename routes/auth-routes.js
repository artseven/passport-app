const express = require('express');
const bcrypt  = require('bcrypt');

const User    = require('../models/user-model.js');


const authRoutes = express.Router();

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup-view.ejs');
});

authRoutes.post('/signup', (req, res, next) =>{
  const signupUsername = req.body.signupUsername;
  const signupPassword = req.body.signupPassword;

// Don't let users submit blank usernames or passwords
  if (signupUsername === '' || signupPassword === '') {
    res.render('auth/signup-view.ejs', {
      errorMessage: 'Please provide both username and password'
    });
    return;
  }

  User.findOne(
    // 1st arg -> criteria of the findOne (which documents)
    { username: signupUsername},
    // 2nd arg -> projection (which fields)
    { username: 1 },
    // 3rd arg -> callback
    (err, foundUser) =>{
      if (err) {
        next(err);
        return;
      }
      // Don't let the user register if the username is taken
      if (foundUser) {
        res.render('auth/signup-view.ejs', {
          errorMessage: 'Username is taken, sir or madam'
        });
        return;
      }

    }
  );
});

module.exports = authRoutes;
