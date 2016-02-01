/*

The request manager manages the whole transaction request life cycle 

*/



module.exports = {


  /**
   * request details to be recieved in req: 

	sender: userId
   	request: {
   		debit [user id], 
   		credit [user id],
   		description [a string connected to the request, e.g. "hey pay me 5 bucks"],
         annonymous: true/false
   		},
   	transaction{
		to [public key],
		from  [public key],
		value [a number of how much money],
		inputs [an array of transaction IDs. NOT a colelction of db models, since we have no idea if these 
				transactions are recorded in our database. ],
      signed: a timestamp of when it was signed (or null)
   		}


   */
   
start_request: function(req, res){

   async.waterfall([
      
      /* first thing: create a new request object and retrieve the prime pk of the credit user, if that was 
      not inclueded in the request */
      function(cb){
         
         async.parallel({

            /* Create the request*/
               request: function(callback){
                  sails.controllers.trequest.initNew(callback,req.sender, req.request, req.transaction);
               },

               /* input the prime pk of the credit user*/
               toPK: function(callback){
                  if (req.transaction.to)
                  {
                     callback(null, req.transaction.to);
                  }
                  else{
                     var callbackback=function(user){
                        callback(user.primePK);
                     }
                  sails.controllers.user.getUserByID(req.request.credit,callbackback);
                  }
               }

            },

            function(err, results){

               if (err)
                  { // HANDLE ERRORS 

                     console.log('and the error is '+err);
                     cb (err);
                     return err;
                  }
               cb(null, results);
            })
      },

      /* create a transaction object assosiated with the created request  */
      function(results, cb)
      {
         var callback = function(err, createdTransaction){ 
            cb(null, results.request, createdTransaction);
         }
         req.transaction.to = results.toPK;
         console.log('the request thing is '+results.request.id);
         sails.controllers.transaction.initWithRequest(req.transaction, results.request.id, callback); 
         
      },

      /* assosiate the request with the transaction on the request side */
      function(createdRequest, createdTransaction, cb){
         console.log('hmmmm whats goin on ');
         sails.controllers.trequest.updateWithTransaction(createdRequest.id,createdTransaction.id, cb);
      } 
     
     
      ],function(err, results){
         console.log(JSON.stringify(results));
         return res.json(results);
   });


},


///

exp_start_req: function(req, res){
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

   this.start_request(req, res);
}


}