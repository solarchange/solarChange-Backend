/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {
	
	 _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

login: function(req, res) {
        passport.authenticate('local', function(err, user, info) {

            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            req.logIn(user, function(err) {
                if (err) res.send(err);

                return res.view('admin/solars',{user:user});
                /*
                return res.send({
                    message: info.message,
                    user: user
                });
                */
            });

        })(req, res);
    },

logout: function(req, res) {
        req.logout();
        res.redirect('/');
    },


//// 0---------------------------

trylogin: function(req, res){
    req.email ='uri.h.y.k@gmail.com';
    req.password = 'abc';

    this.login(req,res);

},





};

