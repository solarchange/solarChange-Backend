/**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	

  block_info:function(req, res){
   var callback = function(err,transi){
      if (err) return res.send(500,{error:err});
      return res.send(200);
   };
   sails.Controllers.transaction.add_from_blockChain(req.body.hash)
  },


  add_from_blockChain: function(hash,date,senders,recipients, callback, relevant_pks){

    var nu_recipients = [];
    var nu_senders = [];

    for (var i=0 ; i <sender.length ; i++)
    {
      nu_senders[i]={pk:senders[i].SenderPublicKey, amount:senders[i].AmountSent};
    }

    for (i=0 ; i<recipient.length ; i++ )
    {
      nu_recipients[i] = {pk:recipients[i].RecipientPublicKey, amount:recipients[i].AmountReceived};
    }

    async.waterfall([


      function(cb){
        Transaction.findOne({hash:hash}).exec(function(err, found){
          if (err) return cb(err);
          return(null, found);
        });
      },

      function(found, cb){

      },

      function(found,cb){

        if (found){
          Transaction.update({hash:hash},{recipients:nu_to, senders:nu, blockChainConfirmed: date}).exec(function(err,updated){
            if (err) return cb(err);
            return cb(null, updated);
          });
        }
        else{
          Transaction.create({hash:hash,recipients:nu_to, senders:nu, blockChainConfirmed: date}).exec(function(err, created){
            if (err) return cb(err);
            return cb(null, created);
          });
        }
      },


      ],
      function(err, transi){
        if (err) return callback(err);
        return callback(null, transi);
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

        console.log('created the transaction');
  			cb(null, created);

  		});

  },


blockChain_input: function(req, res){
  
},

destroy_transactions: function(req, res){
   Transaction.destroy({to:{'!':'joe'}}).exec(function deleteCB(err){
  console.log('The record has been deleted');
   });
},



};

