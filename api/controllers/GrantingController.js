/**
 * GrantingController
 *
 * @description :: Server-side logic for managing grantings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var http = require('http');

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

		async.parallel({

			approval:function(cb){
				
			},

			granting_machine:function(cb){

			}

		},
			function(){});
	},


	
};

