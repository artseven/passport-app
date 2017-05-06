const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('HOME ~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

  console.log('SESSION (from express-session)', req.session);
  // created by express-session middleware

  console.log('USER (from Passport)', req.user);
  // created by Passport
  // Render a completely
  res.render('index');
});

module.exports = router;
