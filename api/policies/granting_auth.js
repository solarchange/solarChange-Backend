/**
 * Allow any authenticated user.
 */
var passport = require('passport');

module.exports = function(req, res, done) {

var auth = req.headers['authorization'];

auth = auth.split(' ')[1];

var buf = new Buffer(auth, 'base64').toString("ascii"); 

console.log('THIS IS ')
console.log(buf);

buf = buf.split(':')[0];

if (!sails.config.granting_token===buf)
{
	console.log('incorrect granting machine auth');
	return res.json({error:'Incorrect token'});
}
console.log('Correct granting machine');

return done();
/*
  passport.authenticate('basic-granting', {session: false}, function(err, user, info) {
    
  	console.log('hahahaha')
    if (err || !user) {
      return res.send("You are not permitted to perform this action.", 403);
    }
    return ok();
  })(req, res, ok);
*/

};