/**
* Transaction.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    /*
    
        recipients and senders should be in the following form:

        [   {publicKey: 'jasdfhjgasdjfhgasd', amount:42},
        ]

    */

    recipients : { type: 'array' },

    senders : { type: 'array' },

    to: {collection: 'public_key', via:'credits'},

    from: {collection: 'public_key', via:'debits'},

    signed : {type: 'integer'}, 

    inputs : { type: 'array', defaultsTo: [] },

    blockChainConfirmed : { type: 'integer', defaultsTo: null },

    hash: { type:'string' },

    trequest : { model: 'trequest'},
  }
};

