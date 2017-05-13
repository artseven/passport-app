const express  = require('express');
const ensure = require('connect-ensure-login');
const router   = express.Router();
const Room = require('../models/room-model.js');

router.get('/rooms/new',
// We need to be logged in to create rooms
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
    res.render('rooms/new-room-view.ejs');
  }
);
// <form method="post" action="/rooms">
router.post('/rooms',
// We need to be logged in to create rooms
  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    const theRoom = new Room({
      name: req.body.roomName,
      description: req.body.roomDescription,
      photoAddress: 'https://media.giphy.com/media/5xtDarqCp0eomZaFJW8/giphy.gif',
      owner: req.user._id
    });

    theRoom.save((err) => {
      if (err) {
        next(err);
        return;
      }

      req.flash('success', 'Your room was saved succesfully');

      res.redirect('/rooms');
    });
  }
);

router.get('/rooms',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
    Room.find(
      { owner: req.user._id },
      (err, roomsList) => {
        if (err) {
          next(err);
          return;
        }

        res.render('rooms/rooms-list-view.ejs', {
          rooms: roomsList,
          successMessage: req.flash('success')
        });
      }
    );
  }
);

module.exports = router;
