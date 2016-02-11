/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	

add_new_user:function(req, res){

async.waterfall([
	function(cb){
		sails.controllers.user.newUser(req.user, req.sessionData, cb);
	},

	function (createdUser, cb){

		var callback = function(err,key){
			console.log('here the key is '+key+' and the user is '+createdUser.id);
			if (err) return cb(err);
		  	cb(null, key, createdUser);
		  	};

		  	(sails.controllers.public_key) ? console.log('YES') : console.log('nooooooooo');

		(req.pk) ? sails.controllers.public_key.newPK(req.pk,createdUser.id,callback) : callback(null, null);
			
	},

	function(createdPK, createdUser, cb){
		console.log('key is '+createdPK +'user is '+createdUser.id);
		//if (err) return cb(err);			
		(createdPK) ? sails.controllers.user.updatePrime(createdUser.id,createdPK.id,cb) : cb(null, createdUser);
	}

	],


	function(err,results){

		console.log('and the results are: '+JSON.stringify(results));
		if (err)
		{
			console.log(err);
			return res.json(err);
		}
		mailer_service.send_confirmation_mail(results.email, results.token);
		return res.json(results);
	});


},


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

activate_user: function(recieved_token, cb){

User.update({token:recieved_token, status:'registered'},{status:'active'}, function(err, changed){
	if (err)
		{// HANDLE ERRORS
			console.log(err);
			cb(err);
			return err;
		}
		if (changed.length===0)
		{
			return cb({error:'No Such User'});
		}

		cb(null, changed[0]);
		
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


/// ------ TESTING FUNCTIONS (to be deletd)


email_try: function(req, res){
	mailer.email_this();
},



tryNewUser: function(req, res){
	
	req.user={
		username: 'Bill',
		firstName: 'Bill',
		lastName: 'Clinton',
		email: 'uri.h.y.k@gmail.com', 
		password: 'abc',
		token:'111',
	};
	req.sessionData={};
	//req.pk='abc';
	this.add_new_user(req, res);

},

activation_trial:function(req, res){
	var cb = function(err, activated_user){
		return res.json(activated_user);
	}

	this.activate_user('111',cb);

},

destroy_users: function(req, res){
	User.destroy({username:'Bill'}).exec(function deleteCB(err){
  console.log('The record has been deleted');
	});
},




};

