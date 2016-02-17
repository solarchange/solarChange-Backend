var passport = require('passport'),
        BasicStrategy = require('passport-http').BasicStrategy;


/*
passport.use(new BasicStrategy(function(email, password, next) {
    console.log('WTF WTF WTF');
    User.findOne({ email: email }).done(function(err, user) {

        if (err) {
            return next(err);
        }
        if (!user) {
            return next(null, false);
        }
        user.validPassword(password, function(err, res) {
            if (err) {
                return next(err);
            }
            next (null, res ? user : false);
        });
    });
}));
*/