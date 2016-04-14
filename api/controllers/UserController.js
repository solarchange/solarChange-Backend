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


	get_balance_history:function(req, res){
		async.waterfall([
			function(cb){
				User.findOne({id:req.headers.sender}).populate('publicKeys').exec(function (err, found) {
					if (err) return cb(err);
					if (!found) return cb ({error:'Wrong ID'});
					return cb(null, found);
				});
			},

			function (found_user, cb) {
				var pks=[];
				async.each(found_user.publicKeys, function(key,callback){
					var cally = function(err, found){
						if (err) return callback(err);
						if (found) pks.push(found);
						return callback(null, found);
					};
					sails.controllers.public_key.get_populated_pk(key.key,cally);
				}, 
					function(err){

						if (err) return cb(err);
						return cb(null, pks);
				});
			},

			function(pks, cb){
				var debs=[];
				var creds=[];
				for (var i=0 ; i<pks.length ; i++)
				{
					for (var j =0 ; j<pks[i].debits.length ; j++)
					{
						debs.push(pks[i].debits[j]);
					}

					for (j=0 ; j<pks[i].credits.length ; j++)
					{
						creds.push(pks[i].credits[j]);
					}
				}
				async.parallel({
					credits:function(callback){
						var credit_arr = [];
						async.each(creds, function(trans,cally){
							var callcall = function(err, found){
								if (err) return cally(err);
								credit_arr.push(found);
								return cally(null,found);
							};
							sails.controllers.transaction.get_request_populated_transaction(trans.id, callcall);
						},
						function(err){
							if (err) return callback(err);
							return callback(null, credit_arr);
						});
					},

					debits:function(callback){
						var debit_arr = [];
						async.each(debs, function(trans,cally){
							var callcall = function(err, found){
								if (err) return cally(err);
								debit_arr.push(found);
								return cally(null,found);
							};
							sails.controllers.transaction.get_request_populated_transaction(trans.id,callcall);
						},
						function(err){
							if (err) return callback(err);
							return callback(null, debit_arr);
						});
					}

				},
					function(err,results){
					if (err) return cb(err);
					return cb(null,pks,results);	
				});
			},

			function(pks, transactions, cb){
					async.parallel({

						credits:function(callback){
							var credit_arr = [];
							async.each(transactions.credits,function(trans,cally){
								var callcall = function(err,arr){
									if (err) return cally(err);
									credit_arr = credit_arr.concat(arr);

									cally(null);
								};
								sails.controllers.user.trans_to_entry(trans,pks,true,callcall);
							},

								function(err){
									if (err) return callback(err);
									return callback(null, credit_arr);
								});
						},

						debits:function(callback){
							var debit_arr = [];
							async.each(transactions.debits,function(trans,cally){
								var callcall = function(err,arr){
									if (err) return cally(err);
									debit_arr = debit_arr.concat(arr);
									cally(null);
								};
								sails.controllers.user.trans_to_entry(trans,pks,false,callcall);
							},

								function(err){
									if (err) return callback(err);
									return callback(null, debit_arr);
								});
						},

					},

						function(err, results){
							if (err) return cb(err);
							var trans_arr = results.credits.concat(results.debits);
							return cb(null,trans_arr);
						});
			},

			],

			function(err, trans_arr){
				if (err) return res.json(err);

				trans_arr = _.sortBy(trans_arr, 'date');

				var balance = 0;

				for (var i = 0 ; i<trans_arr.length; i++)
				{
					balance+=trans_arr[i].amount;
					trans_arr[i].balance = balance;
				}

				return res.json(trans_arr);
		});

	},



	trans_to_entry: function(trans, publicKeys, is_credit, cb){

		var pks =[];

		for (var i=0 ; i<publicKeys.length ; i++)
		{
			pks[i] = publicKeys[i].key;
		}

		if (is_credit) // THIS IS FOR CREDIT TRANSACTIONS
		{
			var amount_counter=0;
			for (i=0; i<trans.recipients.length ; i++)
			{
				if(pks.indexOf(trans.recipients[i].publicKey)>=0 /*&& (trans.recipients[i].publicKey!=trans.senders[0].publicKey)*/)
				{
					amount_counter+=trans.recipients[i].amount;
				}
			}

			// this is to make sure it doesn't count transactions from a user's own public key to itself
			if (amount_counter==0) return cb(null, []); 

			if (trans.trequest){
				if (!trans.trequest.annonymous){
					var callback=function(err,found){
						if (err) return cb(err);
						var from_to = found.debit.firstName+' '+found.lastName;
						return cb(null, [{date:trans.blockChainConfirmed, amount:amount_counter, from_to:from_to}]);
					};
					sails.controllers.trequest.get_populated_with_user(trans.trequest.id,'debit',callback);
				}
				else{
					console.log('heya wHA da f')
					return cb(null,[{date:trans.blockChainConfirmed, amount:amount_counter, from_to:trans.senders[0].publicKey}]);
				}
			}
			else
			{
				var callback = function(err,found){
					if (err) return cb(err);
					if (found){
						if (found.organization) from_to = fond.organization.name;
						else from_to = found.key;
					}
					else from_to = trans.senders[0].publicKey;

					return cb(null,[{date:trans.blockChainConfirmed, amount:amount_counter, from_to:from_to}]);
				};
				sails.controllers.public_key.get_populated_organization(trans.senders[0].publicKey,callback);
			}
		}
		else // THIS IS FOR DEBIT TRANSAC
		{
			if (pks.indexOf(trans.senders[0].publicKey)<0) return cb(null,[]);

			var entry_arr = [];

			async.each(trans.recipients, function(recipient, callback){

				//if (recipient.publicKey == trans.senders[0].publicKey) return callback(null);

				var cally = function(err,found){	
					if (err) return callback(err);
					if (found.organization){
						var from_to = found.organization.name;
					}
					else if (found.user){
						var from_to = found.user.firstName+' '+found.user.lastName;
					}
					else{
						var from_to = recipient.publicKey;
					}
					entry_arr.push({date:trans.blockChainConfirmed, amount:(recipient.amount*-1), from_to:from_to});
					return callback(null);
				};
				sails.controllers.public_key.get_populated_organization_user(recipient.publicKey,cally);
			}, 

				function(err){
					if (err) return cb(err);
					return cb(null, entry_arr);
			});
		} 
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

// var authi = req.headers['authorization'].split(' ')[1];
// var userEmail = new Buffer(authi, 'base64').toString().split(':')[0];

User.update({token:req.body.token, status:'registered'},{status:'active'}, function(err, changed){
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

