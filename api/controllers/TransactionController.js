/**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	

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


destroy_transactions: function(req, res){
   Transaction.destroy({to:{'!':'joe'}}).exec(function deleteCB(err){
  console.log('The record has been deleted');
   });
},



};

