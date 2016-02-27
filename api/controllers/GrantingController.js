/**
 * GrantingController
 *
 * @description :: Server-side logic for managing grantings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

module.exports = {

	register_new_solar_device: function(req, res){
		var new_device_data = req.body;
		new_device_data.user = req.body.sender;


		async.waterfall([	

			// upload the proof of installation file

			/*
				for the file transfer to work the form has to include: enctype="multipart/form-data"
			*/

			function(cb){
				if (!req.file('proof'))	return cb({error:'No proof of installation file'});
				
				var pathName = 'assets/proofFiles/'+req.body.sender;		
				req.file('proof').upload(
						{dirname: require('path').resolve(sails.config.appPath, pathName)}, 
					function(err,files){
						if (err) return cb(err);
						cb (null,files[0]);
					});
			},

			// create the solar device entry

			function(file,cb){
				new_device_data.file_info = file;
				
				sails.controllers.solar_device.new_device(new_device_data,cb);
			},

			],
			function(err, results){
				if (err) return res.json(err);
				results.status = 'pending';
				results.success = true;
				return res.json(results);
			});
	},


	approve_and_sumbmit:function(req, res){

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
					address:solar_device.address,
					city: solar_device.city,
					zipcode: solar_device.zipcode,
					country: solar_device.country,
					nameplate: solar_device.nameplate,
					walletAdress: solar_device.public_key
				}
				var data = {
					firstName:'TEST '+solar_device.firstName,
					lastName:'TEST '+solar_device.lastName,
					email: solar_device.user.email,
					projects:[project]
				} 


				var options = {
				      url:'http://ec2-52-34-149-46.us-west-2.compute.amazonaws.com:8080/claim',
				      headers: {Authorization: 'Basic '+token},
				      method: "POST",
				      json: true,
				      body: data
				    };

				    console.log(options);
				    console.log('this is the DATA ')
				    console.log(options.body);

				request(options,function(err,httRes,body){
				 	if (err) return cb(err);
				 	cb(null, httRes, body)
				 });
			}

		],

		
			function(httRes,body){
				console.log('Res:')
				console.log(httRes)
				console.log('Body:')
				console.log(body.body)
				res.json({grantingRes:httRes,grantingBody:body});
			});
	},


	
};

