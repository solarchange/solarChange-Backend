/**
 * Solar_deviceController
 *
 * @description :: Server-side logic for managing solar_devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	create_txs: function (block_res_txs,pk,cb) {
		async.waterfall([
		function(callback){
				Block_txs.create({key:pk, txs:block_res_txs.length, done:false}).exec(function(err, created){
					if (err) return callback(err);
					return callback(null,created);
				});
		},

		function(created,callback){
			sails.controllers.public_key.make_big(pk,callback);
		},

		],function(err, big_key){
			if (err) return cb(err);
			return cb(null,'big');
		});
	},

	destroy_txs: function(req, res){
		Block_txs.destroy({}).exec(function(err){
			res.json('HA');
		});
	}

}