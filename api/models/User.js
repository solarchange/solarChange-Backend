/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

      /*
        
        primaryPK is a string with the ID (NOT THE KEY) of the primary key

      */
    primaryPK : {type: 'string' }, 

    sessionData : { type: 'array' },

   // username : { type: 'string',required: true, unique: true },

    firstName : { type: 'string', required: true }, 
     
    lastName : { type: 'string', required: true },

    email : { type: 'email', required: true, unique: true },

    password : { type: 'string' , required: true},

    /*
    'active':
    'incomplete':
    'inactive':
    'registered':
    */

    status : { type: 'string', enum: ['active','incomplete','inactive', 'registered'], defaultsTo: 'incomplete' },

    publicKeys : { collection: 'public_key', via: 'user' },

    solar_devices : { collection: 'solar_device', via: 'user' },

    messages : { collection: 'Message', via: 'users' },

    debitRequests : { collection: 'TRequest' , via: 'debit'},

    creditRequests : { collection: 'TRequest' , via: 'credit'},

    token: {type : 'string'},

    /*
     toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
        */
  },


  beforeCreate: function (values, cb) {

    // Encrypt password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  }
};

