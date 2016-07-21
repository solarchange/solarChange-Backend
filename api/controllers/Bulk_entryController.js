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

		var the_file =  fs.readFileSync('docs/massEntries/inputFiles'+req.body.file,'utf8');

		if (!req.body.data_name) return res.json({error:'No naming to the data'});


		async.waterfall([

			function(cb){
				csv.parse(the_file, cb);
			},

			function(data, cb){
				sails.controllers.bulk_entry.use_bulk_data(data,cb);
			},

			function(results,cb){
				var the_solars = _.pluck(results,solar_id);
				var done_errors = [];

				for (var i =0 ; i<results.length ; i++){
					if (results[i].error) done_errors.push(results[i]);
				}

				Bulk_entry.create({
					solars:the_solars,
					initial_solars:results,
					done_solars:done_errors,
					status:'pending',
					report_recievers:req.body.return_email,
					affiliate:req.body.affiliate,
					data_name:req.body.data_name,
					path_to_input_file:'docs/massEntries/'+req.body.file,
					path_to_output_file:null
				}).exec(function(err,created){
					if (err) return cb(err);
					return cb(null,created,results);
				});
			},

			function(the_bulk_entry,results,cb){
				var callback = function(err,done, entry){
					if (err) return cb(err);
					return cb(null,done,entry,results);
				}
				sails.controllers.bulk_entry.validate_bulk_entry(the_bulk_entry,callback);
			},

			function(done,entry,results,cb){
				if (done){
					var callback = function(err,the_entry){
						if (err) return cb(err);
						return cb(null,the_entry,results);
					};
					sails.controllers.bulk_entry.send_report(entry,callback);
				}
				else return cb(null, entry,results);
			}

			 ],function(err,the_bulk_entry, results){
				if (err) return res.send(500,err);
				return res.send(200,results);
			}

			);



		/*

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
		*/
	},

	validate_bulk_entry: function(the_entry,cb){
		if (the_entry.initial_solars.length == the_entry.done_solars.length){
			Bulk_entry.update({id:the_entry.id},{status:'complete'}).exec(function(err,updated){
				if (err) return cb(err);
				return cb(null,true, updated);
			});
		}
		else return cb(null,false, the_entry);
	},


	send_report: function(the_entry,cb){

		var	fields = ['firstName','lastName','email','password','token','ok','error'];

		async.waterfall([

			function(callback){

				json2csv({ data: results, fields: fields }, function(err, csv) {
				  if (err) console.log(err);
				  fs.writeFile('docs/massEntries/outputFiles/'+the_entry.data_name+'.csv', csv, function(err) {
				    if (err) return callback(err);
				    return cb(null);
				  })});

			},

			function(callback){
				Bulk_entry.update({id:the_entry.id},{path_to_output_file:'/docs/massEntries/outputFiles/'+req.body.data_name+'.csv'}).exec(function(err,updated){
					if (err) return callback(err);
					return callback(null,updated[0]);
				});
			},

			function(the_reformed_entry, callback){
				mailer_service.send_report(the_reformed_entry);
				callback(null,the_reformed_entry)
			}


			],function(err,results){
				if (err) return cb(err);
				return cb(null,results);
			});

		// cb(null,true);
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
						status:'bulk_registered',
						from_bulk:true
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
						monitoring_portal_password:entry[14],
						from_bulk:true
					};

					sails.controllers.solar_device.new_device(nu_device,callcall);
				},


				], 

				function(err, the_user, the_device){

					if (!the_device) var the_device = {id:null};
					if (!the_user) var the_user = {id:null};

					if (err){
						results.push({
							firstName:entry[0], 
							lastName:entry[1],
							email:entry[2],
							password:nu_pass,
							token:nu_token,
							ok:false,
							error:JSON.stringify(err),
							solar_id:the_device.id,
							user_id:the_user.id
							});
						return cally();
					}

					results.push( {
							firstName:the_user.firstName, 
							lastName:the_user.lastName,
							email:the_user.email,
							password:nu_pass,
							token:nu_token,
							ok:true,
							error:false,
							solar_id:the_device.id,
							user_id:the_user.id
							});
					return cally();

				});

		}, 

			function(err){
				return cb(null,results);
		});
		
	},


	new_granting:function(solar,granting,cb){

		var the_ok = false;
		if (granting.event == 'approved') the_ok=true;

		async.waterfall([

			function(cb){
				sails.controllers.solar_device.get_device_with_bulk(solar.id,cb);
			},

			function(solar_with_bulk,cb){
				var nu_solars = solar_with_bulk.bulk_entry.done_solars;
				/*
						firstName:the_user.firstName, 
						lastName:the_user.lastName,
						email:the_user.email,
						password:nu_pass,
						token:nu_token,
						ok:true,
						error:false,
						solar_id:the_device.id,
						user_id:the_user.id
				*/

				nu_solars.push({
						firstName:solar_with_bulk.user.firstName, 
						lastName:solar_with_bulk.user.lastName,
						email:solar_with_bulk.user.email,
						password:null,
						token:solar_with_bulk.user.nu_token,
						ok:the_ok,
						error:false,
						solar_id:solar_with_bulk.id,
						user_id:solar_with_bulk.user.id

				});
				Bulk_entry.update({id:solar_with_bulk.bulk_entry.id},{done_solars:nu_solars}).exec(function(err,updated){
					if (err) return cb(err);
					return cb(null,updated);
				});
			},

			function(the_bulk,cb){
				sails.controllers.bulk_entry.validate_bulk_entry(the_bulk,cb);
			},

			function(done,the_bulk,cb){
				if (done){
					return sails.controllers.bulk_entry.send_report(the_bulk,cb);
				}
				else return cb(null,the_bulk);
			},


			],function(err,results){
				if (err) return cb(err);
				return cb(null,results);
		});
	},





};

