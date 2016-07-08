/**
 * Mass_inputController
 *
 * @description :: Server-side logic for managing mass_inputs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var csv = require('csv');
var fs = require('fs');
var path = require('path');
var randomstring = require('just.randomstring');
var crypto = require('crypto');
var base64url = require('base64url');
var json2csv = require('json2csv');

module.exports = {

	_config: {
	   actions: false,
	   shortcuts: false,
	   rest: false
	 },

	read_bulk_from_file: function(req, res){

		var the_file =  fs.readFileSync('docs/massEntries/'+req.body.file,'utf8');

		if (!req.body.data_name) return res.json({error:'No naming to the data'});

		csv.parse(the_file, function(err, data){
			if (err) return res.json(err);

			var cb = function(results){
				
				var	fields = ['firstName','lastName','email','password','token','ok','error'];

				json2csv({ data: results, fields: fields }, function(err, csv) {
				  if (err) console.log(err);
				  fs.writeFile('docs/massEntries/'+req.body.data_name+'.csv', csv, function(err) {
				    if (err) throw err;
				    res.json(results);
				  });
				});

			}
			return sails.controllers.mass_input.use_bulk_data(data, cb);
		});

	},

	use_bulk_data: function(bulk, cb){

		var results = [];


		async.each(bulk, function(entry,cally){

			if (entry[2].indexOf('@')<0) return cally();

			var nu_pass = base64url(crypto.randomBytes(10));

			var nu_token = base64url(crypto.randomBytes(15));

			async.waterfall([

				function(callback){

					var nu_user = {
						firstName:entry[0],
						lastName:entry[1],
						email:entry[2],
						password: nu_pass,
						primaryPK:entry[10],
						token:nu_token,
						status:'bulk_registered'
					};

					sails.controllers.user.newUser(nu_user,{},callback);
				},

				function(the_user, callback){
					var callcall = function(err, the_key){
						if (err) return callback(err);
						return callback(null,the_key, the_user);
					};
					sails.controllers.public_key.newPK(entry[10],the_user.id, callcall);
				},

				function(the_key, the_user, callback){

					var broken_path = entry[11].split('.');
					var ending = broken_path[broken_path.length-1];

					var callcall = function(err, the_device){
						if (err) return callback(err);
						return callback(null,the_user,the_device);
					};
					var nu_device = {
						user:the_user.id,
						firstName:entry[0],
						lastName: entry[1],
						date_of_installation:entry[3],
						address:entry[4],
						city:entry[5],
						state:entry[6],
						zipcode:entry[7],
						country:entry[8],
						nameplate:entry[9],
						public_key:the_key.key,
						file_info:{location:entry[11], type:ending, external:true},
						solar_angel_code:entry[12],
						monitoring_portal_username:entry[13],
						monitoring_portal_password:entry[14]
					};

					sails.controllers.solar_device.new_device(nu_device,callcall);
				},


				], 

				function(err, the_user, the_device){

					if (err){
						results.push({
							firstName:entry[0], 
							lastName:entry[1],
							email:entry[2],
							password:nu_pass,
							token:nu_token,
							ok:false,
							error:JSON.stringify(err)
							});
						return cally();
					}

					mailer_service.send_bulk_confirmation_mail(the_user.email,nu_token,the_user.firstName);
					results.push( {
							firstName:the_user.firstName, 
							lastName:the_user.lastName,
							email:the_user.email,
							password:nu_pass,
							token:nu_token,
							ok:true,
							error:false
							});
					return cally();

					

				});

		}, 

			function(err){
				return cb(results);
		});

		
		
	},



// ------- This is just for testing and not relevant =-----


	read_mass_file:function(req, res){


		var the_file =  fs.readFileSync('docs/massEntries/'+req.body.file,'utf8');

		csv.parse(the_file, function(err, data){

			if (err) return res.json(err);

			return res.json(data);

		});
	},



};

