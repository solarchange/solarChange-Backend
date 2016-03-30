/**
* Transaction.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    /*
    
        to and from should be in the following form:

        [   {pk: 'jasdfhjgasdjfhgasd', amount:42},
        ]

    */

    recipients : { type: 'array' },

    senders : { type: 'array' },

    to: {collection: 'public_key', via:'credits'},

    from: {collection: 'public_key', via:'debits'},

    signed : {type: 'date'}, 

    inputs : { type: 'array', defaultsTo: [] },

    blockChainConfirmed : { type: 'date', defaultsTo: null },

    hash: { type:'string' },

    trequest : { model: 'trequest'},
  }
};

