/**
 * Allow any authenticated user.
 */
var passport = require('passport');

module.exports = function(req, res, ok) {
  passport.authenticate('basic-userJJJJJJ', {session: false}, function(err, user, info) {
   	console.log('WHAT IS  GOIN ON ON ON ON ON ONO ON ONO ON ONO ON ON ONO ON ')

    if (err || !user) {
      return res.send("You are not permitted to perform this action.", 403);
    }

    return ok();
  })(req, res, ok);
};