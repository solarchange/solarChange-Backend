/**
* Granting.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	message: { type : 'json' },

  	from: {type:'string', enum:['solar_change','granting_machine']},

  	to:{type:'string', enum:['solar_change', 'granting_machine']}

  }
};

