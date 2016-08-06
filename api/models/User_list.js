/**
* User_list.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	users : {collection:'user', via:'action_list'},

  	action : {type: 'string', enum:['activation_mail']},

  	status : {type: 'string', enum:['done', 'pending', 'over']},

  	name : {type:'string', unique:true} 


  }
};

