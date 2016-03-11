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


	add_event_from_granting_machine: function(granting_id,event_to_add,time ,cb){
		
		async.waterfall([
			function(callback){
				Solar_device.findOne({granting_id:granting_id}).exec(function(err,found){
				if (err) return callback(err);
				return callback(null,found)});
				},

			function(found,callback){
				var approval_history_arr = found.approval_history;
				approval_history_arr.push({event:event_to_add,date:time});
				Solar_device.update({granting_id:granting_id},{approval_history:approval_history_arr}).exec(function(err,updated){
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

	get_solar_device_status: function(req,res){
		Solar_device.findOne({id:req.params['solar_id']}).populate('user').exec(function(err,found){
			if (err) return res.json(err);
			if (!found) return res.json({error:'No such solar device'});
			if (found.user.id!=req.headers.sender) return res.json({error:'Solar Device does not belong to user'});
			return res.json(sails.controllers.solar_device.get_status_of_solar_device(found));
		});
	},

	get_user_solar_status: function(req,res){
		var cb = function(err,solars){
			if (err) return res.json(err);
			for (var i = solars - 1; i >= 0; i--) {
					solars[i].status = get_status_of_solar_device(solars[i]);
				}
			return res.json(solars);
		};
		sails.Controllers.user.get_solars(req.headers.sender,cb);
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

