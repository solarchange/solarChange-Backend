/**
* SolarDevice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    user : { model : 'user' },

    address : { type: 'string' },

    city: { type: 'string' },

    zipcode: { type: 'string' },

    country: { type: 'string' },

    nameplate: { type: 'string' },

    public_key: {  model: 'public_key'},

    data : { type: 'json' }
  }
};

