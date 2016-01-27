/**
 * RequestController
 *
 * @description :: Server-side logic for managing requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	

  initNew: function (cb, sender, request, transaction) {

  	var initObj = {at:Date.now(),by:sender};
  	var confirmedObj = (transaction.from) ? {at: Date.now(),by:sender} : null;

  	/*
  	var newTransaction = {
  		to: req.transaction.to,
  		from:req.transaction.from,
  		value: req.transaction.value,
  		inputs: req.transaction.inputs,
  	}
  	*/

    var theRequest = {
    	debit: request.debit,
    	credit: request.credit,
    	description: request.description,
    	init: initObj,
      annonymous: request.annonymous,
    	confirmed: confirmedObj,
    	rejected: null
    };

    Trequest.create(theRequest).exec(function afterCreation(err, created){
      if (err)
      {
        cb (err);
        return err;
      }
      console.log("here we see that "+JSON.stringify(created));
      cb(null, created);
    });

  },

  updateWithTransaction: function(requestID, transactionID, cb){

    transaction.update({id: requestID},{transaction:transactionID}).exec(function aferUpdate(err,updated){
      if (err)
      {
        // HANDLE ERRORS
        cb (err);
        return(err);
      }
      cb(updated);
    });

  },


////// --------------------








  exp_start_req: function(req, res){

    console.log('here yeah ');
    req.sender='123';
    req.request = {
       debit: '321',
       credit: '123',
       description:'some request for money',
    };
    req.transaction = {
       to:'abc',
       from:'cba',
       value:10,
       inputs: [],
    };

    request_manager.start_request(req, res);
  }
};

