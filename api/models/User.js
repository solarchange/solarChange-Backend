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

    status : { type: 'string', enum: ['active','incomplete','inactive', 'registered', 'bulk_registered'], defaultsTo: 'incomplete' },

    publicKeys : { collection: 'public_key', via: 'user' },

    solar_devices : { collection: 'solar_device', via: 'user' },

    messages : { collection: 'Message', via: 'users' },

    debitRequests : { collection: 'TRequest' , via: 'debit'},

    creditRequests : { collection: 'TRequest' , via: 'credit'},

    /*
      social_shares should look like this:
      [
      {
          social_network:'facebook',
          item:'www.solarchange.com',
          date:7272746823
      }
      ]
    */

    bulk_entry: {model:'bulk_entry', via:'users'},

    social_shares: {type: 'array', defaultsTo:[]},

    token: {type : 'string'},

    recovery_token: {type:'string', defaultsTo:null},

    recovery_mail_send_date: {type: 'integer', defaultsTo:null},

    from_bulk: {type:'boolean', defaultsTo:false},

    action_list:{model:'user_list'},

     toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        },
        
  },

  beforeCreate: function (values, cb) {
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      cb();
    });
  }
};

