/**
 * PublicKeyController
 *
 * @description :: Server-side logic for managing publickeys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var request = require('request');
var http = require('http');

module.exports = {
	

  send_pk:function(req,res){
    this.get_pks_transactions(['huhuhuhuhuhuhuh'], res.json);
  },



  get_pks_transactions:function(pks, cb){
    var way = 'get-info?pubKeys=';
    var begin = true;
    for (i=0; i<pks.length ; i++){
      if (begin) begin = false;
      else way = way+'|';
      way = way+pks[i];
    }

    var options = {
              url:sails.config.blockChainUnit.url+way,
              headers: {Authorization: 'Basic '},
              method: "GET",
              json:true,
            };

    request(options,function(err,httRes,body){
          if (err) return cb(err);
          //var txs = JSON.parse(body);
          console.log(body.txs)
          async.each(transactions, function(a_transaction,callback){
            sails.controllers.transaction.add_from_blockChain(a_transaction,cb);
          },
          function(err){
            if (err) return cb(err);
            return cb();
          });

         });
  },


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

  make_sure_created: function(pk_ar,cb){
    async.each(pk_ar,function(pk,callback){
      Public_key.findOrCreate({key:pk},{key:pk, user:null, currentValue:null, blockchain_status:'external'}).exec(function(err, created){
  
        if (err) return callback(err);
        return callback(null,created);
      });
    },function(err){
      if (err) return cb(err);
      return cb();
    });
  },

  get_populated_pk:function(key,cb){
      Public_key.findOne({key:key}).populate('debits').populate('credits').exec(function(err,found){
        if (err) return cb(err);
        return cb(null,found);
      });
  },

  get_populated_organization: function(key, cb){
    Public_key.findOne({key:key}).populate('organization').exec(function(err,found){
        if (err) return cb(err);
        return cb(null,found);
      });
  },

  get_populated_organization_user: function(key, cb){
    Public_key.findOne({key:key}).populate('user').populate('organization').exec(function(err,found){
        if (err) return cb(err);
        return cb(null,found);
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

