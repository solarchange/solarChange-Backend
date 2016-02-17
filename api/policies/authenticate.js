/*
var express = require('express'),
        app = express(),
        passport = require('passport'),
        local = require('../../config/local');

app.use(passport.initialize());*/

/**
 * Allow any authenticated user.
 */
var passport = require('passport');

module.exports = function(req, res, ok) {
  // User is allowed, proceed to controller
  console.log('now this is where its at')
  passport.authenticate('basic', {session: false}, function(err, user, info) {
    console.log(user)
    if (err || !user) {
      return res.send("You are not permitted to perform this action.", 403);
    }
    return ok();
  })(req, res, ok);
};