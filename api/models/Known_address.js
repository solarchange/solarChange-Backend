/**
* Known_address.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

autoPK:false,

  attributes: {

    key : { type: 'string', unique: true, primaryKey: true},

  	name: { type:'string' },

  	organization: {model:'organization'},

  }
};

