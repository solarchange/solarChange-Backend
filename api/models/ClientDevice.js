/**
* ClientDevice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    user : { type: 'string' },

    type : { type: 'string' },

    IPs : { type: 'string' },

    deviceDetails : { type: 'string' },

    sessions : { model: 'sessionData' }
  }
};

