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

// -------


destroy_solars: function(req, res){
	Solar_device.destroy({}).exec(function deleteCB(err){
  console.log('The record has been deleted');
	});
},


};

