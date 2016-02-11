/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	getUserByID: function(eyed,cb){
		User.findOne({id:eyed}, function(err,found){
			if (err)
			{
				console.log('theres an error in the whole user finiding thing '+ err +" user "+eyed);
				// HANDLE ERROR
				cb(err);
				return err;
			}
			console.log('getting the user '+eyed);
			cb(null, found);
		});
	},


newUser: function(nu_user, initialSessionData, cb){

	var new_status = (nu_user.username && nu_user.firstName && nu_user.lastName && nu_user.email && nu_user.password) ? 'registered' : 'incomplete';

	var sesh = [initialSessionData];

	var the_new_user = {
		username:nu_user.username,
		firstName: nu_user.firstName,
		lastName: nu_user.lastName,
		email: nu_user.email,
		password: nu_user.password,
		status: new_status,
		sessionData: sesh,
		token:nu_user.token
	};

	User.create(the_new_user).exec(function userCreated(err,created){
		if (err)
		{// HANDLE ERRORS
			console.log(err);
			cb(err);
			return err;
		}
		cb(null, created);
	});
},

updatePrime: function(userID,key,cb){
	User.update({id:userID},{primaryPK:key}).exec(function afterUpdate(err,updated){
		if (err)
		{	
			// HANDLE ERRORS
			cb(err);
			return err;
		}
		console.log('wookoadf');
		cb (null, updated);
	});
},





email_try: function(req, res){
	mailer.email_this();
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

destroy_users: function(req, res){
	User.destroy({username:'joe'}).exec(function deleteCB(err){
  console.log('The record has been deleted');
	});
},




};

