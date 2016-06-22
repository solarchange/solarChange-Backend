  /**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	





  block_info:function(req, res){

   // return res.send(200);

  //var transactions = JSON.parse(req.body.transactions);
  var transactions = req.body;

  async.waterfall([
        function(cb){
          sails.controllers.transaction.make_sure_pks_are_there(transactions,cb);
        },

        function(cb){
          async.each(transactions, function(a_transaction,cb){
            sails.controllers.transaction.add_from_blockChain(a_transaction,cb);
          },
          function(err){
            if (err) return cb(err);
            return cb(null,{ok:true});
            
          });
         },
    ],

    function(err, results){
      if (err) return res.send(500,{error:err});
      return res.send(200);
    });
  },
  
  
  make_sure_pks_are_there:function(txs,cb){
   // console.log('making sure things are there')
    var pks = [];

    for (var i =0 ; i<txs.length ; i++){
      for (var j = 0 ; j<txs[i].recipients.length ; j++){
        pks.push(txs[i].recipients[j].publicKey);
      }
      for (var k = 0 ; k<txs[i].senders.length ; k++){
        pks.push(txs[i].senders[k].publicKey);
      }
    }

    sails.controllers.public_key.make_sure_created(pks,cb);

  },

  add_from_blockChain: function(the_transaction, callback){
    var hash = the_transaction.hash;
    var date = the_transaction.date;
    var senders = the_transaction.senders;
    var recipients = the_transaction.recipients;


    async.waterfall([

      function(cb){

        Transaction.findOne({hash:hash}).exec(function(err, found){
          if (err) return cb(err);
          return cb(null, found);
        });
      },

      function(found,cb){

         var nu_to=[];
        for (var i=0; i<recipients.length ; i++)
        {
          nu_to.push(recipients[i].publicKey);
        }

        var nu_from=[];

        for (var i=0; i<senders.length ; i++)
        {
          nu_from.push(senders[i].publicKey);
        }

        nu_to=_.uniq(nu_to);
        nu_from=_.uniq(nu_from);

        if (found){
          Transaction.update({hash:hash},{recipients:recipients, senders:senders, blockChainConfirmed: date, to:nu_to, from:nu_from}).exec(function(err,updated){
            if (err) return cb(err);
            return cb(null, updated, nu_to,nu_from);
          });
        }
        else{
          Transaction.create({hash:hash,recipients:recipients, senders:senders, blockChainConfirmed: date, to:nu_to, from:nu_from}).exec(function(err, created){
           if (err) {
            console.log(err)
          }
            if (err) return cb(err);
            return cb(null, created,nu_to,nu_from);
          });
        }
      },

      ],
      function(err, transi){

      //  console.log('ok, done with a transaction here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

        if (err) return callback(err);
        return callback(null, transi);
    });

  },

 

  get_request_populated_transaction:function(id,cb){
    Transaction.findOne({id:id}).populate('trequest').exec(function(err, found){
      if (err) return cb(err);
      return cb(null, found);
    });
  },


  initWithRequest: function (to_create, created_trequest_id, cb) {

  	var isSigned = to_create.signed || null;
  	var theStatus = isSigned ? 'sent' : 'unsent';

  	var newTransaction = {
  		to: to_create.to,
  		from:to_create.from,
  		value: to_create.value,
  		inputs: to_create.inputs,
  		blockChainInfo:{},
  		trequest:created_trequest_id,
  		signed: isSigned,
  		status: theStatus
  		};

  		Transaction.create(newTransaction).exec(function afterCreated(err, created){
  			if (err)
  			{
  				// HANDLE ERROR
  				cb (err);
  				return err;
  			}
        
  			cb(null, created);

  		});

  },


blockChain_input: function(req, res){
  
},

destroy_transactions: function(req, res){
   Transaction.destroy({to:{'!':'joe'}}).exec(function deleteCB(err){
  console.log('The record has been deleted');
  return res.json('wooooo wiiiiii')
   });
},



};

