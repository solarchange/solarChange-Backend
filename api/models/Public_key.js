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

    user : { model: 'user', via:'publicKeys'},

    debitTs : {collection: 'transaction', via: 'from'},

    creditTs : {collection: 'transaction', via: 'to'},

    solar_device : { model: 'solar_device' },

    currentValue : { type: 'float', defaultsTo: 0 },

    blockchain_status: {type:'string', enum:['confirmed', 'unconfirmed'], defaultsTo:'unconfirmed'}
  }
};

