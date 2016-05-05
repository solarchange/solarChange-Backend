/**
* Organization.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoPK:false,

  attributes: {

  	name: {type: 'string', unique: true, primaryKey: true},

  	email: {type: 'string'},

  	known_addresses: {collection: 'known_address', via:'organization'}

  }
};

