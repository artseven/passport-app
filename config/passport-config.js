const passport     = require('passport');
const User         = require('../models/user-model.js');
const bcrypt       = require('bcrypt');
// const passportLocal = require('passport-local');
// const LocalStrategy = passportLocal.Strategy;
//                                  SAME ||
const LocalStrategy = require ('passport-local').Strategy;
const FbStrategy    = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// Determines WHAT TO SAVE in the session(what to put in the box)
// (called when you log in)
passport.serializeUser((user, cb) => {
  // cb is short for "callback"
  cb(null, user._id);
});

// Where to get the rest of the user's information (given what's in the box)
// (called on EVERY request AFTER you log in)
passport.deserializeUser((userId, cb) => {
  // Query the database with the ID from the box
  User.findById(userId, (err, theUser) =>{
    if (err) {
      cb(err);
      return;
    }
    // sending the user's info to passport
    cb(null, theUser);
  });
});

passport.use( new FbStrategy (
  {
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL:'/auth/facebook/callback'
  },            // address for a route in our app
  (accessToken, refreshToken, profile, done) => {
    console.log('');
    console.log('FACEBOOK PROFILE~~~~~~~~~~~~~~~~~');
    console.log(profile);

    User.findOne(
      { facebookID: profile.id },
      (err, foundUser) => {
        if(err) {
          done(err);
          return;
        }
        // If user is already registered, just log them in!
        if (foundUser) {
          done(null, foundUser);
          return;
        }
        // Register the user if they are not registered
        const theUser = new User({
          facebookID: profile.id,
          name: profile.displayName
        });

        theUser.save((err) => {
          if (err) {
            done();
            return;
          }
          // This logs in the newly registered user
          done(null, theUser);
        });
      }
    );
  }
) );

passport.use( new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    console.log('');
    console.log('GOOGLE PROFILE~~~~~~~~~~~~~~~~~');
    console.log(profile);
    console.log('');

    User.findOne(
      { googleID: profile.id},
      (err, foundUser) => {
        if (err) {
          done(err);
          return;
        }

        if(foundUser) {
          done(null, foundUser);
          return;
        }

        const theUser = new User({
          googleID: profile.id,
          name: profile.displayName
        });

        // If name is empty, save the email as the "name".
        if (!theUser.name) {
          theUser.name = profile.emails[0].value;
        }

        theUser.save((err) => {
          if(err) {
            done(err);
            return;
          }
          done(null, theUser);
        });
      }
    );
  }
));

passport.use(new LocalStrategy(
  // 1st arg -> options to customize LocalStrategy
  {
    // <input name="loginUsername">
    usernameField: 'loginUsername',
    // <input name="loginPassword">
    passwordField: 'loginPassword'
  },

  // 2nd arg -> callback for the logic that validates the login
  (loginUsername, loginPassword, next) =>{
    User.findOne(
      { username: loginUsername},
        (err, theUser) => {
          //  Tell passport if there was an error(nothing we can do)
          if (err) {
           next(err);
           return;
          }
          // Tell passport if there is no user with given username
          if(!theUser) {
          //          false in 2nd arg means "Log in failed!"
          //            |
           next(null, false, { message: 'Wrong username'});
           return;
          }
          // Tell passport if the passwords don't match
          if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
            // false means "Log in failed!"
            next(null, false, { message: 'Wrong password'});
            return;
          }
          // Give passport the user's details
          next(null, theUser, { message: `Login for ${theUser.username} successful`});
          //  -> this user goes to passport.serializeUser()
        }
    );
  }
) );
