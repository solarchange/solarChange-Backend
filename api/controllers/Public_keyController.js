/**
 * PublicKeyController
 *
 * @description :: Server-side logic for managing publickeys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	

  add_non_blockchained_key: function(req, res){
    var to_create={};
    to_create.key = req.body.key;
    to_create.user = req.headers.sender;
    Public_key.create(to_create).exec(function(err, created){
      if (err) return res.json(err);
      sails.controllers.public_key.get_blockchain_history(created.key);
      return res.json(created);
    });
  },

  add_from_solar_device: function(key, device_id,user_id,cb){
    Public_key.findOrCreate({key:key},{key:key, user:user_id},function(err,pk){
      if (err) return cb(err);

      Public_key.update({key:key},{solar_device:device_id}).exec(function(err,updated){
        if (err) return cb(err);

        if (updated.blockchain_status=='unconfirmed') sails.controllers.public_key.get_blockchain_history(updated.key);
        return cb(null, updated);
      });
    });
  },

  get_blockchain_history:function(key){
  
    // THIS IS WHERE THE BLOCKCHAIN THING WOULD BE GETTING TO

  },


  /**
   * `PublicKeyController.newPrime()`
   */
  newPK: function (keyString, user, cb) {
  	
  	var theUser = user || null;

  	Public_key.create({key:keyString, user:theUser}).exec(function afterPKCreation(err, created){
  		if (err) return cb(err);
  		cb(null, created);
  	});
  },


};

