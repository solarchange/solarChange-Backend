/**
 * User_listController
 *
 * @description :: Server-side logic for managing user_lists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	send_activation_mail_by_status:function(req, res){
		async.waterfall([

			function(cb){
				sails.controllers.user.get_filtered_users({status:req.body.status,cb});
			},

			function(users,cb){

				for (var i=0 ; i < users.length ; i++){
					if (users[i].token){
						mailer_service.send_confirmation_mail(users[i].email, users[i].token, users[i].firstName);
					}
				}

				var the_ids = _.pluck(users,'id');
				if (!req.body.name) req.body.name = Date.now();
				User_list.create({users:the_ids, action:'activation_mail', status:'done', name:req.body.name}).exec(function(err,created){
					if (err) return cb(err);
					return cb(null,created);
				});
			},

			],function(err, results){
				if (err) return res.send(500,err);
				return res.send(200,results);
		});
	},

	get_list_info_by_name:function(req, res){
		User_list.findOne({name:req.body.name}).populate('users').exec(function(err,found){
			if (err) return res.send(500,err);
			if (req.body.users_only && req.body.att) return res.send(200,_.pluck(found.users, req.body.att));
			if (req.body.users_only) res.send(200,found.users);
			return res.send(200,found);
		});
	},

	start_list_with_activation:function(req,res){
		async.waterfall([

			function(cb){
				sails.controllers.user.get_filtered_users({status:req.body.status,cb});
			},

			function(users,cb){
				if (req.body.no_list){
					User_list.findOne({name:req.body.no_list}).populate('users').exec(function(err,found){
						if (err) return cb(err);
						var ids = _.pluck(found.users, 'id');
						var user_ids = _.pluck(users, 'id');
						for (var i =0 ; i<user_ids.length ; i++){
							if (ids.idexOf(user_ids[i])>=0) users[i]=false;
						}
						for (i=users.length-1 ; i>=0 ; i--){
							if (!users[i]) users.pop();
						}

						return cb(null,users);
					});
				}
				else{	
					return cb(null,users)
				}
			},

			function(users,cb){


				for (var i=0 ; i < users.length ; i++){
					if (users[i].token){
						mailer_service.send_confirmation_mail(users[i].email, users[i].token, users[i].firstName);
					}
				}

				var the_ids = _.pluck(users,'id');
				if (!req.body.name) req.body.name = Date.now();
				User_list.create({users:the_ids, action:'activation_mail', status:'done', name:req.body.name}).exec(function(err,created){
					if (err) return cb(err);
					return cb(null,created);
				});
			},

			],function(err, results){
				if (err) return res.send(500,err);
				return res.send(200,results);
		});
	},

};

