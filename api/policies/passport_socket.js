/** Content not generated BEGIN */
var http = require('http'),
  passport = require('passport')
  , methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];
/** Content not generated END */

module.exports = function (req, res, next) {
  // Initialize Passport
  passport.initialize()(req, res, function () {
    // Use the built-in sessions
    passport.session()(req, res, function () {
      // Make the user available throughout the frontend
      res.locals.user = req.user;

      /** Content not generated BEGIN */
      // Make the passport methods available for websocket requests
      if (req.isSocket) {
        for (var i = 0; i < methods.length; i++) {
          req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
        }
      }
      /** Content not generated END */

      next();
    });
  });
};