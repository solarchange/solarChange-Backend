/**
 * Known_addressController
 *
 * @description :: Server-side logic for managing known_addresses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



get_address:function(key,cb){
	Known_address.findOne({key:key}).exec(function(err,found){
		if (err) return cb(err);
		return cb(null, found);
	});
},

	
};

