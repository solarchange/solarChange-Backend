/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      /*
        
        primaryPK is a string with the ID (NOT THE KEY) of the primary key

      */
    primaryPK : {type: 'string' }, 

    sessionData : { type: 'array' },

    username : { type: 'string' },

    firstName : { type: 'string' },

    lastName : { type: 'string' },

    email : { type: 'string' },

    password : { type: 'string' },

    status : { type: 'string', enum: ['active','incomplete','inactive', 'registered'], defaultsTo: 'incomplete' },

    publicKeys : { collection: 'public_key', via: 'user' },

    solarDevices : { collection: 'solarDevice', via: 'user' },

    messages : { collection: 'Message', via: 'users' },

    debitRequests : { collection: 'TRequest' , via: 'debit'},

    creditRequests : { collection: 'TRequest' , via: 'credit'}
  }
};

