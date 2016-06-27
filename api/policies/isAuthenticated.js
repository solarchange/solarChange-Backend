var passport = require('passport');


module.exports = function(req, res, next) {

 if (req.isSocket)
 {
        req = _.extend req, _.pick(require('http').IncomingMessage.prototype, 'login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated')
    middleware = passport.authenticate('bearer', { session: false })
    return middleware(req, res, next)
}


   if (req.isAuthenticated()) {
   	console.log('hoooooray fuck fuck')
        return next();
    }
    else{
        return res.redirect('/');
    }
};
