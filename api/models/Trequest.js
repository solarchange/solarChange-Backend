
/**
* trequest.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    debit : { model: 'User' },

    credit : { model: 'User' },

    transaction : { model: 'Transaction' },

    description : { type: 'string' },

    /*   EVERY Request is initiated by a specific user in a specific time, which will be recorded like this: 
		init 
		{	at: timestamp,
			by: userId  } */

	init : {type: 'json'},

	 /* A request is confirmed once its accompanying transaction has both "to" and "from" public keys
		confirmed 
		{ 	at: timestamp,
			by: userId }  */

	confirmed : {type: 'json' , defaultsTo: null},

	rejected : {type: 'json', defaultsTo: null},

	/* a request is signed by the 'debit' user ALWAYS. this will record the time of signing. 
	   a request that was both signed and confirmed is sent to the blockchain */

	annonymous : {type: 'boolean'},

	isPending: function(){
		if (!(this.transaction.signed && this.confirmed) || this.rejected) return false;
	
		return true;
	},

	sentToChain: function(){
		return (this.transaction.signed && this.confirmed) || false;
	},

  }
};

