bcrypt = require('bcrypt');

module.exports = {

authenticate: function(email, password, done) {

    Admin.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('no user like that at all yo yo yo')
        return done(null, false);
      }

      bcrypt.compare(password, user.password, function (err, res) {
        if (err) console.log('hahhahahahahhahah')
          if (!res){
            console.log('the thing is not working rightly --- ')
            return done(null, false);
          }
          var returnUser = {
            email: user.email,
            name: user.name,
            permissions: user.permissions,
            createdAt: user.createdAt,
            id: user.id
          };
          console.log('so this is how it goes')
          return done(null, true);
        });
    });
  }
}