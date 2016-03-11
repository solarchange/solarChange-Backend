/**
* External_service.js
*
* @descrition :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

  	name: {type: 'string'},

  	email: {type: 'string'},

  	contact_person: {'type': 'string'},

  	token: {type:'string'},

  	password: {type:'string', defaultsTo:''},


  beforeCreate: function (values, cb) {

    // Encrypt password
    bcrypt.hash(values.token, 10, function(err, hash) {
      if(err) return cb(err);
      values.token = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  },
 


  }
};

