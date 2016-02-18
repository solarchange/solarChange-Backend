/**
 * Solar_deviceController
 *
 * @description :: Server-side logic for managing solar_devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	

	new_device: function(data,cb){
		
		solar_device.create(data).exec(function(err,created){

		});
	},

};

