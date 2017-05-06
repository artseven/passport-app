const express = require('express');
const ensure  = require('connect-ensure-login');

const routerThingy = express.Router();


// routerThingy.get('/user/:id/edit', (req, res, next) => {
routerThingy.get('/profile/edit',
//          redirects to /login if you are NOT logged in
  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
  // If not 'ensureLoggedIn()' we would have to do this:
  // if (!req.user) {
  //   res.redirect('/login');
  //   return;
  // }
  //
  res.render('user/edit-profile-view.ejs');
});

module.exports = routerThingy;
