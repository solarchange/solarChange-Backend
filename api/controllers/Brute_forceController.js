
var request = require('request');
var http = require('http');
var fs = require('fs');
var path = require('path');


module.exports = {

	_config: {
	   actions: false,
	   shortcuts: false,
	   rest: false
	 },

	 	send_mail_manually:function(req, res){
		var dummy_device = {id:req.body.device_id};
		sails.controllers.granting.send_granting_mail(dummy_device,req.body.event,req.body.detail);
	},


	submit_to_granting_machine: function(req, res){


		async.waterfall([

			function(cb){
				sails.controllers.solar_device.get_populated_device(req.body.solar_device_id,cb);
			},

			function(solar_device,cb){

				var token = new Buffer(sails.config.granting_token+':').toString('base64');
				console.log('the token is ');
				console.log(token);
				var project = {
					"address":solar_device.address,
					"city": solar_device.city,
					"zipCode": solar_device.zipcode,
					"state": solar_device.state,
					"country": solar_device.country,
					"nameplate": solar_device.nameplate,
					"walletAddress": solar_device.public_key,
					"documentation":"http://internalvalidation.solatchange.co/",
				};

				var data = {
					"firstName":solar_device.firstName,
					"lastName":solar_device.lastName,
					"email": solar_device.user.email,
					"projects":[project]
				};
				
				var options = {
				      //url:'http://ec2-52-34-149-46.us-west-2.compute.amazonaws.com:8080/claim',
				      url:sails.config.granting_url+'/claim',
				      headers: {Authorization: 'Basic '+token},
				      method: "POST",
				      json:true,
				      body:data
				    };

				    var callback = function(err,res,body,solar){
				    	cb(err,res,body,solar);
				    }

				request(options,function(err,httRes,body){
					console.log('submitted Solar device to Granting Machine for '+solar_device.firstName+' '+solar_device.lastName);
					if (err) console.log(err);
				 	if (err) return cb(err);
				 	console.log('Successful in registering the Solar Device');
				 	callback(null, httRes, body, solar_device);
				 });

				},

			function(httRes,body,solar_device,cb){
				Granting.create({message:body,from:'granting_machine',to:'solar_change'}).exec(function(err,created){
					if (err) return cb(err);
					return cb(null, httRes, body, solar_device);
				});
			},


			function(httRes,body, solar_device, cb){
				console.log('-----------------------')
				console.log(body)
				console.log('-----------------------')
				sails.controllers.granting.after_submission(solar_device, body, cb);
			},

			function(the_device,cb){
				var callback = function(err,found_device){
					if (err) return cb(err);
					// mailer_service.solar_device_submitted(found_device.user.email, found_device);
					return cb(null,found_device);
				};
				sails.controllers.solar_device.get_populated_device(the_device.id,callback);
			}
		],

			function(err, final_device){
				if (err){ 
					console.log(err);
					return res.json(err);
				}
				console.log('Have submitted a Solar Device to the granting Machine');
				return res.json([final_device]);
			});

	},



	submit_to_granting_machine_by_email: function(req, res){


		async.waterfall([

			function(cb){
				sails.controllers.user.get_solars_by_email(req.body.email,cb);
			},

			function(solar_devices,cb){
				
				var solar_device = solar_devices[0];

				var token = new Buffer(sails.config.granting_token+':').toString('base64');
				console.log('the token is ');
				console.log(token);
				var project = {
					"address":solar_device.address,
					"city": solar_device.city,
					"zipCode": solar_device.zipcode,
					"state": solar_device.state,
					"country": solar_device.country,
					"nameplate": solar_device.nameplate,
					"walletAddress": solar_device.public_key,
					"documentation":"http://internalvalidation.solatchange.co/",
				};

				var data = {
					"firstName":solar_device.firstName,
					"lastName":solar_device.lastName,
					"email": solar_device.user.email,
					"projects":[project]
				};
				
				var options = {
				      //url:'http://ec2-52-34-149-46.us-west-2.compute.amazonaws.com:8080/claim',
				      url:sails.config.granting_url+'/claim',
				      headers: {Authorization: 'Basic '+token},
				      method: "POST",
				      json:true,
				      body:data
				    };

				    var callback = function(err,res,body,solar){
				    	cb(err,res,body,solar);
				    }

				request(options,function(err,httRes,body){
					console.log('submitted Solar device to Granting Machine for '+solar_device.firstName+' '+solar_device.lastName);
					if (err) console.log(err);
				 	if (err) return cb(err);
				 	console.log('Successful in registering the Solar Device');
				 	callback(null, httRes, body, solar_device);
				 });

				},

			function(httRes,body,solar_device,cb){
				Granting.create({message:body,from:'granting_machine',to:'solar_change'}).exec(function(err,created){
					if (err) return cb(err);
					return cb(null, httRes, body, solar_device);
				});
			},


			function(httRes,body, solar_device, cb){
				console.log('-----------------------')
				console.log(body)
				console.log('-----------------------')
				sails.controllers.granting.after_submission(solar_device, body, cb);
			},

			function(the_device,cb){
				var callback = function(err,found_device){
					if (err) return cb(err);
					// mailer_service.solar_device_submitted(found_device.user.email, found_device);
					return cb(null,found_device);
				};
				sails.controllers.solar_device.get_populated_device(the_device.id,callback);
			}
		],

			function(err, final_device){
				if (err){ 
					console.log(err);
					return res.json(err);
				}
				console.log('Have submitted a Solar Device to the granting Machine');
				return res.json([final_device]);
			});

	},


}