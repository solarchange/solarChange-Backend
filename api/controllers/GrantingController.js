/**
 * GrantingController
 *
 * @description :: Server-side logic for managing grantings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');
var http = require('http');
var fs = require('fs');
var path = require('path');


module.exports = {

	register_new_solar_device: function(req, res){
		var new_device_data = req.body;

		//if (req.body.sender) req.headers.sender = req.body.sender;

		new_device_data.user = req.headers.sender;
		
		var key = new_device_data.public_key;
		//new_device_data.public_key=null;

		async.waterfall([	

			// upload the proof of installation file

			/*
				for the file transfer to work the form has to include: enctype="multipart/form-data"
			*/

			function(cb){
				if (!req.body.proof) return cb({error:'No proof of installation file'});
				// var dir = path.join(__dirname, '../../assets/proofFiles/'+req.headers.sender);
				var dir = path.join(__dirname, '../../docs/proofFiles/'+req.headers.sender);
				
				if (!fs.existsSync(dir)){
    				fs.mkdirSync(dir);
					}
				// var pathName =path.join(__dirname, '../../assets/proofFiles/'+req.headers.sender+'/proof'+Date.now()+'.'+req.body.file_type);
				var pathName =path.join(__dirname, '../../docs/proofFiles/'+req.headers.sender+'/proof'+Date.now()+'.'+req.body.file_type);
				var bitmap = new Buffer(req.body.proof, 'base64');
				fs.writeFile(pathName, bitmap, function(err){
					if (err) return cb(err);
					var file_info = {location:pathName,type:req.body.file_type, external:false};
					return cb (null,file_info);
				});	
			},

			// create the solar device entry

			function(file,cb){
				new_device_data.file_info = file;
				delete new_device_data.proof;
				sails.controllers.solar_device.new_device(new_device_data,cb);
			},

			function(device,cb){
				var callback = function(err,wallet){	
					if (err) return cb(err);
					return cb(null,device,wallet);
				}

				sails.controllers.public_key.add_from_solar_device(key,device.id,device.user,callback);
			},

			function(device,wallet,cb){
				var callback = function(err,user){
					if (err) return cb(err);
					return cb(null, device,wallet, user);
				}
				sails.controllers.user.get_user(req.headers.sender,callback);
			}


			],
			function(err, results, wallet,user){
				if (err) return res.json(err);
				results.status = 'pending';
				results.success = true;
				mailer_service.solar_device_registration(user.email,results, wallet[0], user);
				return res.json(results);
			});
	},


	approve_and_submit:function(req, res){

		async.waterfall([

			function(cb){
				sails.controllers.solar_device.add_event(req.body.solar_device_id,'submitted',cb);
			},

			function(solar_devices, cb){
				var solar_device = solar_devices[0];
				var callback = function(err,user)
				{
					if (err) return cb(err);
					solar_device.user = user;
					cb (null,solar_device)
				}
				sails.controllers.user.getUserByID(solar_device.user, callback);
			},

			function(solar_device,cb){

				var token = new Buffer(sails.config.granting_token+':').toString('base64');
				console.log('the token is ');
				console.log(token);
				var project = {
					"address":solar_device.address,
					"city": solar_device.city,
					"zipCode": solar_device.zipcode,
					"country": solar_device.country,
					"nameplate": solar_device.nameplate,
					"walletAddress": solar_device.public_key
				};

				var data = {
					"firstName":'TEST '+solar_device.firstName,
					"lastName":'TEST '+solar_device.lastName,
					"email": solar_device.user.email,
					"projects":[project]
				};
				
				var options = {
				      url:'http://ec2-52-34-149-46.us-west-2.compute.amazonaws.com:8080/claim',
				      headers: {Authorization: 'Basic '+token},
				      method: "POST",
				      json:true,
				      body:data
				    };

				    var callback = function(err,res,body,solar){
				    	cb(err,res,body,solar);
				    }

				request(options,function(err,httRes,body){
				 	if (err) return cb(err);
				 	callback(null, httRes, body, solar_device);
				 });

				},

			function(httRes,body, solar_device, cb){
				console.log(body)
				sails.controllers.granting.after_submission(solar_device, body, cb);
			},
		],

			function(err, final_device){
				if (err) return res.json(err);
				return res.json(final_device);
			});
	},

	after_submission: function(device,granting_response, cb){
		device.approval_history.push({event:'submitted', date:granting_response.timestamp});

		Solar_device.update({id:device.id},{granting_id:granting_response.id, affiliate:granting_response.affiliate, approval_history:device.approval_history})
		.exec(function(err,updated){
			mailer_service.solar_device_submitted(updated[0].user.email, updated[0]);
			if (err) return cb(err);
			return cb(null, updated);
		});
	},


	granting_judgement: function(req, res){
		var cb = function(err,updated){
			if (err) return res.json(err);

			return res.json({events:updated[0].approval_history, 
				grantings:updated[0].solar_grantings,
				id:updated[0].granting_id});
		};
		sails.controllers.solar_device.add_granting(req.body.id,req.body,req.body.timestamp,cb);
	},

	send_granting_mail: function(device){
		async.waterfall([
			function(cb){
				
			},
			], 
			function(err,results){

		});
	},


	parse_granting_reply:function(granting_reply){
		switch (granting_reply.event){
			case 'approved':
				return 'granting_approved';
				break;
			case 'rejected':
				return 'granting_rejected';
				break;
		}

	},

};

