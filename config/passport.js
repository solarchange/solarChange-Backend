var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
BasicStrategy = require('passport-http').BasicStrategy,
bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Admin.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});



passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {

    Admin.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
          var returnUser = {
            email: user.email,
            name: user.name,
            permissions: user.permissions,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
        });
    });
  }
));

passport.use('basic-user',new BasicStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
 
   User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
          var returnUser = {
            email: user.email,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
        });

    });
}));


passport.use('basic-granting-machine',new BasicStrategy({
    usernameField: 'token',
    passwordField: 'password'
  },
  function(token, password, done) {
 
    console.log('token '+token)

   User.findOne({ name: 'granting_machine' }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Error: not granting machine.' });
      }

      bcrypt.compare(token, user.token, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
          var returnUser = {
            email: user.name,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
        });
    });
}));


/*

///////   --------- this is how it used to be in the user login


passport.deserializeUser(function(id, done) {
    User.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {

    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
          var returnUser = {
            email: user.email,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
        });
    });
  }
));



*/



