/**
 * Solar_deviceController
 *
 * @description :: Server-side logic for managing solar_devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	new_device: function(new_device_data,cb){
		new_device_data.approval_history = [{event:'pending',date:Date.now()}];
		Solar_device.create(new_device_data).exec(function(err,created){
			if (err) return cb(err);
			Solar_device.publishCreate(created);
			cb(null,created);
		});
	},

	get_devices:function(filter,cb){
		Solar_device.find(filter).exec(function(err,found){
			if (err) return cb(err);
			cb(null,found);
		});
	},

	add_event: function(device_id,event_to_add,cb){
		Solar_device.findOne({id:device_id}).exec(function(err,found){
			if (err) return cb(err);
			var approval_history_arr = found.approval_history;
			approval_history_arr.push({event:event_to_add,date:Date.now()});
			Solar_device.update({id:device_id},{approval_history:approval_history_arr}).exec(function(err,updated){
				if (err) return cb(err);
				Solar_device.publishUpdate(updated[0].id,{approval_history:approval_history_arr});
				cb(null, updated);
			});
		});
	},


	add_granting: function(granting_id,granting_detail,time ,cb){
		
		async.waterfall([
			function(callback){
				Solar_device.findOne({granting_id:granting_id}).exec(function(err,found){
				if (err) return callback(err);
				return callback(null,found)});
				},

			function(found,callback){

				var update_variables = sails.controllers.solar_device.update_device_with_granting(found,granting_detail);

				Solar_device.update({granting_id:granting_id},update_variables).exec(function(err,updated){
					if (err) return callback(err);
					return callback(null, updated);
				});
			}
				
			],

			function(err,added){
				if (err) return cb(err);
				return cb(null, added);
			}
		);


		/*
		Solar_device.findOne({granting_id:granting_id}).exec(function(err,found){
			if (err) return cb(err);
			var approval_history_arr = found.approval_history;
			approval_history_arr.push({event:event_to_add,date:time});

			Solar_device.update({id:granting_id},{approval_history:approval_history_arr}).exec(function(err,updated){
				if (err) return cb(err);
				if (!updated.length) return cb({error:'No such solar device'});
				Solar_device.publishUpdate(updated[0].id,{approval_history:approval_history_arr});
				cb(null, updated);
			});
		});
		*/
	},

	update_device_with_granting:function(device,granting){

		var to_update = {};

		if (granting.event)
		{	
			var event_to_add = sails.controllers.solar_device.parse_granting_event(granting.event);
			if (event_to_add){
				to_update.approval_history = device.approval_history;
				to_update.approval_history.push({event:event_to_add, date:granting.timestamp});
			}
		}

		if (granting.period_start)
		{
			var granting_to_add = sails.controllers.solar_device.parse_granting_period(granting);
			to_update.solar_grantings = device.solar_grantings;
			if (!to_update.solar_grantings) to_update.solar_grantings=[];
			to_update.solar_grantings.push(granting_to_add);
		}

		return(to_update);

	},

	parse_granting_period:function(granting){
		return({coins_granted:granting.coins_granted,
				energy_generated:granting.energy_generated,
				period_start:granting.period_start,
				period_end:granting.period_end,
				key:granting.key,
				date:granting.timestamp
			});
	},

	parse_granting_event:function(granting_reply){
		switch (granting_reply.event){
			case 'approved':
				return 'granting_approved';
				break;
			case 'rejected':
				return 'granting_rejected';
				break;
		}
		return false;

	},

	get_solar_device_status: function(req,res){
		Solar_device.findOne({id:req.params['solar_id']}).populate('user').exec(function(err,found){
			if (err) return res.json(err);
			if (!found) return res.json({error:'No such solar device'});
			if (found.user.id!=req.headers.sender) return res.json({error:'Solar Device does not belong to user'});
			return res.json({status:sails.controllers.solar_device.get_status_of_solar_device(found), 
							grantings:found.solar_grantings});
		});
	},

	get_user_solar_status: function(req,res){
		/*
		var cb = function(err,solars){
			if (err) return res.json(err);
			
			for (var i = solars - 1; i >= 0; i--) {
					solars[i].status = get_status_of_solar_device(solars[i]);
			}
				
			return res.json(solars);
		};
		sails.Controllers.user.get_solars(req.headers.sender,cb);
		*/

		Solar_device.find({user:req.headers.sender}).populate('public_key').exec(function(err, found){
			if (err) return res.json(err);
			return res.json(found);
		});

	},

	get_status_of_solar_device: function(solar)
	{	
		return solar.approval_history[solar.approval_history.length-1];
	},

	get_device: function(solar_device_id,cb){
		Solar_device.findOne({id:solar_device_id}).exec(function(err,found){
			if (err) return cb(err);
			return cb(null,found);
		});
	},

// -------


destroy_solars: function(req, res){
	Solar_device.destroy({}).exec(function deleteCB(err){
  console.log('The record has been deleted');
	});
},


};

