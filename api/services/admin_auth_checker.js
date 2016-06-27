bcrypt = require('bcrypt');

module.exports = {

authenticate: function(email, password, done) {

    Admin.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }

      bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false);
          var returnUser = {
            email: user.email,
            name: user.name,
            permissions: user.permissions,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, true);
        });
    });
  }
}