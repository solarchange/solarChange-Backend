/**
* Transaction.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    to : { model: 'public_key' },

    from : { model: 'public_key' },

    value : { type: 'float' },

    signed : {type: 'date'}, 

    inputs : { type: 'array', defaultsTo: [] },

    blockChaninInfo : { type: 'json', defaultsTo: {} },

    hash: { type:'string' },

    trequest : { model: 'trequest'},

    status : {type: 'string', enum:['used','approved', 'unsent', 'sent'], defaultsTo: 'unsent'}
  }
};

