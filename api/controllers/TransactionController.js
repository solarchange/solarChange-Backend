/**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	





  block_info:function(req, res){

  //var transactions = JSON.parse(req.body.transactions);
  var transactions = req.body;

  async.each(transactions, function(a_transaction,cb){
    sails.controllers.transaction.add_from_blockChain(a_transaction,cb);
  },
  function(err){
    if (err) return res.send(500,{error:err});
    console.log('OK OK OK OK OK OK')
    return res.send(200);
  });
  //var recipients = JSON.parse(req.body.recipients);
  //var senders = JSON.parse(req.body.senders);
   //sails.controllers.transaction.add_from_blockChain(req.body.hash, req.body.date, senders, recipients, callback);
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

      /*
      function(found, cb){
        if (found!==undefined) return cb(null, found);

        console.log('AM HERE WHAT DA FUKN------------------------')
        Transaction.create({recipients:recipients, senders:senders, hash:hash, blockChainConfirmed:date}).exec(function(err,created){
          if (err) return cb(err);
          return cb(null,created);
        });
      },
      */

      function(found, cb){
        var nu_to=[];
        for (var i=0; i<recipients.length ; i++)
        {
          nu_to.push(recipients[i].publicKey);
        }
        var cally=function(err){
          if (err) return cb(err);
          return cb(null,found,nu_to);
        }; 
        sails.controllers.public_key.make_sure_created(nu_to,cally);

      },

      function(found, nu_to, cb){
        var nu_from=[];

        for (var i=0; i<senders.length ; i++)
        {
          nu_from.push(senders[i].publicKey);
        }
        var cally=function(err){
          if (err) return cb(err);
          return cb(null,found,nu_to, nu_from);
        }; 
        sails.controllers.public_key.make_sure_created(nu_from,cally);
      },


      function(found,nu_to,nu_from,cb){

        if (found){
          Transaction.update({hash:hash},{recipients:recipients, senders:senders, blockChainConfirmed: date, to:nu_to, from:nu_from}).exec(function(err,updated){
            if (err) return cb(err);
            return cb(null, updated, nu_to,nu_from);
          });
        }
        else{
          Transaction.create({hash:hash,recipients:recipients, senders:senders, blockChainConfirmed: date, to:nu_to, from:nu_from}).exec(function(err, created){
            if (err) return cb(err);

            console.log('AWEHrasdg;kawhrsfg,uagsfdghj,gzsrhkqfgirhlgsdr')
            console.log(created)
            return cb(null, created,nu_to,nu_from);
          });
        }
      },

      function(tx,nu_to,nu_from,cb){
        async.parallel({
          to:function(callback){
            sails.controllers.public_key.add_txs(tx.id,nu_to,'to',callback);
          },
          from:function(callback){
            sails.controllers.public_key.add_txs(tx.id,nu_from,'from',callback);
          }
        },
          function(err, results){
            if (err) return cb(err);
            return cb(null, tx);
          });
      },

      ],
      function(err, transi){
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

