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
			if (err) cb(err);
			cb(null,created);
		});
	},

	get_devices:function(filter,cb){
		Solar_device.find(filter).exec(function(err,found){
			cb(err,found);
		});
	},

	locally_approve_device: function(device_id,cb){
		Solar_device.update({id:device_id},{})
	},

};

