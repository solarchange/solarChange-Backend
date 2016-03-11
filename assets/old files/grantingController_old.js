/**
 * GrantingController
 *
 * @description :: Server-side logic for managing grantings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');
var http = require('http');

http.post = require('http-post');

var json_request = require('request-json');

var needle = require('needle');

var rest = require('restler');

module.exports = {

	register_new_solar_device: function(req, res){
		var new_device_data = req.body;

		if (req.body.sender) req.headers.sender = req.body.sender;

		new_device_data.user = req.headers.sender;

		console.log('and now the device is ')
		console.log(new_device_data)

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

				//data = JSON.stringify(data);

				var options = {
				      // url:'http://ec2-52-34-149-46.us-west-2.compute.amazonaws.com:8080/claim',
				      headers: {Authorization: 'Basic '+token},
				      json:true,
				      //body: JSON.stringify(data)
				      //body:data
				    };

				/*
				var options = {
				      url:'http://ec2-52-34-149-46.us-west-2.compute.amazonaws.com:8080/claim',
				      headers: {Authorization: 'Basic '+token},
				      method: "POST",
				      json:true,
				      //body: JSON.stringify(data)
				      body:data
				    };

				    console.log(options);
				    console.log('this is the DATA ')
				    console.log(options.json);

				request(options,function(err,httRes,body){
				 	if (err) return cb(err);
				 	cb(null, httRes, body)
				 });
				*/

				/*
				var options = {
					hostname:'ec2-52-34-149-46.us-west-2.compute.amazonaws.com',
					path: '/claim',
					port: '8080',
					method: 'POST',
					headers:{Authorization: 'Basic '+token},
					//	body: data
				};

				http.request(options,function(res){
					console.log('result of this is ');
					console.log(res);
				})
				 */				
				/*
				var client =json_request.createClient('http://ec2-52-34-149-46.us-west-2.compute.amazonaws.com:8080/');
				client.setBasicAuth(sails.config.granting_token,'');
				console.log('the data is ')
				console.log(data)
				client.post('claim',data,function(err,res,body){
					console.log(err);

					//console.log(res);
					//console.log(body);
				})*/

				/*
				http.post(options,data,function(res){
					console.log('----------------------------------------------')
					//response.setEncoding('utf8');
					res.setEncoding('utf8');
					res.on('data', function(chunk) {
						console.log(chunk);
					});
					console.log('THIS IS IS IS IS IS IS IS ')
				});
				*/
				/*
				needle.request('post','http://ec2-52-34-149-46.us-west-2.compute.amazonaws.com:8080/claim',data,options,function(err,res,body){
					console.log('---------------------------------------------')
					console.log(err)
					console.log('0000999999999999999999999235294593476597346973697')
					console.log(body)
				});
				*/

				rest.postJson('http://ec2-52-34-149-46.us-west-2.compute.amazonaws.com:8080/claim',data,options).on('complete', function(data, response) {
  				console.log(data)
  				console.log('----------------------------------------------------------------------------')
  				console.log(response)
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

