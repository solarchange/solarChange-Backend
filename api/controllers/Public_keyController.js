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



get_blockchain_data:function(req,res){

  var pk_arr = [req.params.pk];
  var cb = function(err, success){
    if (err) return res.json(err);
    return res.json(success);
  };

sails.controllers.public_key.get_pks_blockchain_info(pk_arr,cb);
},


  get_blockchain_history:function(pks, cb){

    var authHeader = new Buffer(sails.config.blockChainUnit.username+':'+sails.config.blockChainUnit.password).toString('base64');

    async.waterfall([

      function(callback){
        var way = 'get-info?pubKeys=';
        var begin = true;
        for (i=0; i<pks.length ; i++){
          if (begin) begin = false;
          else way = way+'|';
          way = way+pks[i];
        }

        var options = {
                  url:sails.config.blockChainUnit.url+way,
                  headers: {Authorization: 'Basic '+authHeader},
                  method: "GET",
                  json:true,
                };

        request(options,function(err,httRes,body){

          console.log('090909090090909009')
            console.log(err)
            console.log('----------------------------')
            // console.log(body)
            console.log('...................................')
              if (err) return callback(err);
              return callback(null,body);

             });
      },


      function(block_res,callback){
        var cally = function(err){
          if (err) return callback(err);
          return callback(null,block_res);
        };
        sails.controllers.transaction.make_sure_pks_are_there(block_res.txs,cally);

      },


      function(block_res,callback){

        // console.log('////////////////////////////////////////////////////////')
        var bla = sails.controllers.public_key.get_current_balanace(block_res.txs, pks[0])
       // console.log(bla)
       // console.log('.........................................................')

        async.each(block_res.txs, function(a_transaction,callcall){
          sails.controllers.transaction.add_from_blockChain(a_transaction,callcall);
          },
          function(err){
            if (err) return callback(err);
            return callback(null,{success:true});
              });             
      }

      ],function(err,success){
        
        console.log('whas goin on onononononononononononoonononononoononoononononono')

        console.log(success)

        console.log('0--0-0-0-0-0-0--0-0-0-0-0-0-0-0-0-0-0-0--0-0-')
        
        if (err) return cb(err);

        var options = {
                  url:sails.config.blockChainUnit.url+'set-public-keys',
                  headers: {Authorization: 'Basic '+authHeader},
                  method: "POST",
                  json:true,
                  body:pks
                };

        request(options,function(err,httRes,body){
              if (err) return cb(err);
              return cb(null,{success:true});
             });
    });
  },

  get_current_balanace:function(txs,key){
  var amount = 0;
  var cred = 0;
  var deb = 0;
  for (var i=0; i<txs.length; i++){
    var inside_it = false
    for (var j=0; j<txs[i].recipients.length ; j++)
    {
      if (txs[i].recipients[j].publicKey==key) 
        { 
          inside_it = true;
          amount = amount+txs[i].recipients[j].amount;
          cred = cred+txs[i].recipients[j].amount;
        }
    }

    for (j=0; j<txs[i].senders.length ; j++)
    {
      if (txs[i].senders[j].publicKey==key)
      {
        inside_it = true;
        amount = amount-txs[i].senders[j].amount;   
        deb=deb+txs[i].senders[j].amount;    
      }
    }

    if (!inside_it) console.log('WIIIIIIIWOOOOOOO NOT INSIDE THE TRANSACTioN YO YO YO YO YO YO YO YO OY YOY OY OYO YO YOY ')
  }

  return amount;

  },


  add_key: function(req, res){

    console.log('yo this is whats going on now. i am acting yet again. this is called')

    async.waterfall([

      function(cb){
        Public_key.findOne({key:req.body.key}).populate('user').exec(function(err,found){
          if (err) return cb(err);
          return cb(null,found);
        });
      },

      function(found,cb){

        if (found){
          if (found.user){
            console.log('what da funk ufnkkkkkkkk')
            return cb({error:'This Key Belongs to another user'});
          }

          console.log('this key already exists------')
          Public_key.update({key:req.body.key},{user:req.headers.sender}).exec(function(err,updated){
            if (err) return cb(err);
            return cb(null,updated);
          });
        }
        else {
          var to_create={};
          to_create.key = req.body.key;
          to_create.user = req.headers.sender;
          console.log('zonkin the key here yo yo yo yo yo yo yo yoy oo')
          Public_key.create(to_create).exec(function(err, created){
          if (err) return cb(err);
          console.log('yyuuuuuuuuuuuuuuuuuuuu')
          console.log(created)
            return cb(null,created);
          });
        }
      },

      function(created, cb){
          var callback = function(err, success){
            if (err) return cb(err);
            return cb(null,created,success);
          };
         sails.controllers.public_key.get_blockchain_history([created.key],callback);
      },

      function(created, success, cb){
        if (success){
          Public_key.update({key:created.key},{blockchain_status:'confirmed'}).exec(function(err,updated){
            if (err) return cb(err);
            return cb(null,updated);
          });
        }
        else return cb({error:'could not get data from blockchain'});
      }

      ],

      function(err,created){
        if (err) return res.json(err);
        return res.json(created);
      })
  },

  add_from_solar_device: function(key, device_id,user_id,cb){

    async.waterfall([
      function(callback){
        Public_key.findOrCreate({key:key},{key:key, user:user_id},function(err,pk){
          if (err) return cb(err);

          Public_key.update({key:key},{solar_device:device_id}).exec(function(err,updated){
            if (err) return cb(err);
            return callback(null, updated);
          });
        });
      },

      function(key_object,callback){
            if (key_object.blockchain_status=='unconfirmed'){
            async.waterfall([
              function(callcall){
              var cally = function(err,success){
                if (err) return callback(err);
                return callback(null,key_object)
              };
              sails.controllers.public_key.get_blockchain_history([updated.key], cally);
              }
              ],
              function(err,the_key){
                Public_key.update({key:key_object.key},{blockchain_status:'confirmed'}).exec(function(err,updated){
                  if (err) return callback(err);
                  return callback(null,updated);
                });
               });
           }
            else return callback(null,key_object);
      }

      ],
      function(err,key_object){
        if (err) return cb(err);
        return cb(null,key_object);
      });
   
  },

  make_sure_created: function(pk_ar,cb){

    pk_ar = _.uniq(pk_ar);

    //console.log(pk_ar);

    async.each(pk_ar,function(pk,callback){
      Public_key.findOrCreate({key:pk},{key:pk, user:null, currentValue:null, blockchain_status:'external'}).exec(function(err, created){

        if (err) return callback(err);
        return callback(null,created);
      });
    },function(err){
      if (err) console.log(err)
      if (err) return cb(err);

      return cb(null);
    });
  },



  add_txs:function(tx_id,keys,to_from, cb){

  if (to_from=='to') var cred_deb = 'credits';
  else var cred_deb = 'debits';

    var search_obj = [];
    for (var i =0 ; i<keys.length ; i++){
      search_obj.push({key:keys[i]});
    }
  
      Public_key.find({or:search_obj}).populate(cred_deb).exec(function(err,found){
        if (err) return cb(err);

        async.each(found,function(wallet,callback){
          wallet[cred_deb].add(tx_id);
          wallet.save(function(err,saved){
            if (err) return callback(err);
            return callback(null);
          });
        },

          function(err){
            if (err) return cb(err);
            return (cb(null,found));
        });
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

destroy_keys:function(req,res){
  Public_key.destroy({}).exec(function(err){
    res.json('YEAAAAH')
  });
},

};

