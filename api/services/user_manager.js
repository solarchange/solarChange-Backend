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

async.waterfal([
	function(cb){
		sails.controllers.user.newUser(req.user, req.sessionData, cb);
	},

	function (createdUser, cb){

	var callback = function(err,key){
	  	cb(createdKey,createdUser)
	  	}

	(req.pk) ? sails.controllers.publicKey.newPK(req.pk,createdUser.id,callback) : callback(null, null);
		
	},

	function(createdPK, createdUser, cb){
		(createdPK) ? sails.controllers.user.updatePrime(createdUser.id,createdPK.id,cb) : cb(createdUser);
	}

	],



	function(err,results){

	});


},



}