/**
* Public_key.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoPK:false,

  attributes: {

    key : { type: 'string', unique: true, primaryKey: true},

    user : { model: 'user'},

    debits : {collection: 'transaction', via: 'from'},

    credits : {collection: 'transaction', via: 'to'},

    solar_device : { model: 'solar_device' },

    currentValue : { type: 'float', defaultsTo: 0 },

    known: {type: 'boolean', defaultsTo:false},

    organization: {model: 'organization'},

    blockchain_status: {type:'string', enum:['confirmed', 'unconfirmed', 'external'], defaultsTo:'unconfirmed'}
  }
};

