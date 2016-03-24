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
		sails.controllers.user.newUser(req.body, req.sessionData, cb);
	},

	function (createdUser, cb){

		var callback = function(err,key){
			if (err) return cb(err);
		  	cb(null, key, createdUser);
		  	};

		(req.pk) ? sails.controllers.public_key.newPK(req.pk,createdUser.id,callback) : callback(null, null);
			
	},

	function(createdPK, createdUser, cb){	
		(createdPK) ? sails.controllers.user.updatePrime(createdUser.id,createdPK.id,cb) : cb(null, createdUser);
	}

	],


	function(err,results){
		if (err)
		{
			console.log(err);
			return res.json(err);
		}
		mailer_service.send_confirmation_mail(results.email, results.token);
		results.success=true;
		return res.json(results);
	});


},

	user_login: function(req, res){
		var authi = req.headers['authorization'].split(' ')[1];
		var userEmail = new Buffer(authi, 'base64').toString().split(':')[0];
		console.log('the email is')
		console.log(userEmail)
		User.findOne({email:userEmail}).populate('solar_devices').populate('publicKeys').exec(function(err,found){
			if (err) return res.json(err);
			if (!found) return res.json({error:'email and password do not match'});
			found.success=true;
			return res.json(found);
		});

	},


	getUserByID: function(eyed,cb){
		User.findOne({id:eyed}, function(err,found){
			if (err)
			{
			
				// HANDLE ERROR
				cb(err);
				return err;
			}
			cb(null, found);
		});
	},


newUser: function(nu_user, initialSessionData, cb){

	if (!nu_user) return cb({error:'Missing User'});

	var new_status = (nu_user.firstName && nu_user.lastName && nu_user.email && nu_user.password) ? 'registered' : 'incomplete';

	var sesh = [initialSessionData];

	var the_new_user = {
		// username:nu_user.username,
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

activate_user: function(req, res){

var authi = req.headers['authorization'].split(' ')[1];
var userEmail = new Buffer(authi, 'base64').toString().split(':')[0];

User.update({token:req.body.token, email:userEmail, status:'registered'},{status:'active'}, function(err, changed){
	if (err) return res.json(err);
	if (changed.length===0) return res.json({error:'No Such User'});

	changed[0].success=true;
	mailer_service.send_activation_mail(changed[0].email, changed[0].firstName);
	return res.json({success:true});
		
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

		cb (null, updated);
	});
},


get_solars: function(user_id,cb){
User.findOne({id:user_id}).populate('solar_devices').exec(function(err,the_user){
	if (err) return cb(err);
	return cb(null,the_user.solar_devices);
});
},


add_public_key:function(){
	
},


social_share:function(req,res){	
	async.waterfall([
		
		function(cb){
			User.findOne({id:req.headers['sender']}).exec(function(err,found){
				if (err) return cb(err);
				return cb(null,found);
			});
		},

		function(the_user,cb){
			if (!the_user.social_shares) the_user.social_shares = [];
			the_user.social_shares.push({social_network:req.body.social_network,
				item:req.body.item,
				date:Date.now()
			});
			User.update({id:req.headers['sender']},{social_shares:the_user.social_shares}).exec(function(err,updated){
				if (err) return cb(err);
				return cb(null, updated);
			});
		}

		],
		function(err, updated){
			if (err) return res.json(err);
			return res.json({shares:updated.social_shares, success:true});
	});
},


/// ------ TESTING FUNCTIONS (to be deleted late)


email_try: function(req, res){
	mailer.email_this();
},



tryNewUser: function(req, res){
	
	req.user={
		//username: 'Bill',
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
	User.destroy({}).exec(function deleteCB(err){
  console.log('The record has been deleted');
	});
},




};

