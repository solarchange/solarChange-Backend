/**
* Public_key.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    key : { type: 'string', unique: true},

    user : { model: 'user' },

    debitTs : {collection: 'transaction', via: 'from'},

    creditTs : {collection: 'transaction', via: 'to'},

    solar_device : { model: 'solar_device' },

    currentValue : { type: 'float', defaultsTo: 0 }
  }
};

