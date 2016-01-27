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
      function(cb){
         
         async.parallel([
            
            request: function(callback){
               sails.controllers.trequest.initNew(callback,req.sender, req.request, req.transaction);
            },

            toPK: function(callback){
               if (req.transaction.to)
               {
                  callback(req.transaction.to);
               }
               else{
                  var callbackback=function(user){
                     callback(user.primePK);
                  }
               sails.controllers.user.getUserByID(req.request.credit,callbackback);
               }
            }

            ],

            function(err, results){
               if (err)
                  { // HANDLE ERRORS 
                     cb (err);
                     return err;
                  }
               cb(null, results);
            })
      },

      function(results, cb)
      {
         var callback = function(err, createdTransaction){ 
            cb(results.request, createdTransaction);
         }
         req.transaction.to = results.toPK;
         sails.controllers.transaction.initWithRequest(req.transaction, results.request.id, callback); 
         
      },

      function(createdRequest, createdTransaction, cb){

         sails.controllers.trequest.updateWithTransaction(createdRequest.id,createdTransaction.id,);
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