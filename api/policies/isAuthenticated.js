var passport = require('passport');


module.exports = function(req, res, next) {

   if (req.isAuthenticated()) {
   	console.log('hoooooray fuck fuck')
        return next();
    }
    else{
        return res.redirect('/');
    }
};
