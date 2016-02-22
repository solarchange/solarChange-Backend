/**
* Admin.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    email : { type: 'string' },

    password : { type:'string'},

    name : { type: 'string'},

    status: {type: 'string', enum:['active','inactive'], defaultsTo:'active'},

    permissions: {type: 'array', defaultsTo:['read','write','approve-solar-device']},

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

