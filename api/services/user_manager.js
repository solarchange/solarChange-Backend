/*

The user manager manages the user lifecycle - registering, logging in and so forth

*/



module.exports = {


/*


add_new_user is AFTER VALIDATION AND AUTHENTICATION. 

the parameters of the "add_new_user" function should be:

req.user = {
	username: user name
	firstName: first name
	lastName: last name
	email: email 
	password: hash of password
}

req.sessionData = {
	the session data about the first user session
}

req.pk ={
	key
}



*/

add_new_user:function(req, res){

async.waterfall([
	function(cb){
		sails.controllers.user.newUser(req.user, req.sessionData, cb);
	},

	function (createdUser, cb){

		var callback = function(err,key){
			if (err) return cb(err);
		  	cb(null, key, createdUser);
		  	};

		  	(sails.controllers.public_key) ? console.log('YES') : console.log('nooooooooo');

		(req.pk) ? sails.controllers.public_key.newPK(req.pk,createdUser.id,callback) : callback(null, null);
			
	},

	function(err,createdPK, createdUser, cb){
		if (err) return cb(err);			
		(createdPK) ? sails.controllers.user.updatePrime(createdUser.id,createdPK.id,cb) : cb(createdUser);
	}

	],


	function(err,results){
		if (err)
		{
			console.log(err);
			return res.json(err);
		}
		mailer.send_confirmation_mail(results.email, results.token);
		return res.json(results);
	});


},

tryNewUser: function(req, res){
	
	req.user={
		username: 'Joe',
		firstName: 'Joe',
		lastName: 'Smith',
		email: 'email@email.com', 
		password: '1234321'
	};
	req.sessionData={};
	req.pk='abc';
	user_manager.add_new_user(req, res);

},


}