/**
* Transaction.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    to : { model: 'publicKey' },

    from : { model: 'publicKey' },

    value : { type: 'float' },

    signed : {type: 'date'}, 

    inputs : { type: 'array', defaultsTo: [] },

    blockChaninInfo : { type: 'json', defaultsTo: {} },

    tRequest : { model: 'tRequest'},

    status : {type: 'string', enum:['used','approved', 'unsent', 'sent'], defaultsTo: 'unsent'}
  }
};

