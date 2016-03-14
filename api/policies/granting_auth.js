/**
 * Allow any authenticated user.
 */
var passport = require('passport');

module.exports = function(req, res, ok) {
  passport.authenticate('basic-granting-machine', {session: false}, function(err, user, info) {
    if (err || !user) {
    	console.log('error is ')
    	console.log(err)
    	console.log('user:')
    	console.log(user)
      return res.send("You are not permitted to perform this action.", 403);
    }
    return ok();
  })(req, res, ok);
};