/**
* SolarDevice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    user : { model : 'user' },

    owner: {type:'string'},

    date_of_installation: {type:'date'},

    address : { type: 'string' },

    city: { type: 'string' },

    state: {type: 'string'},

    zipcode: { type: 'string' },

    country: { type: 'string' },

    nameplate: { type: 'string' },

    /*
			public_key here is NOT a model since it is possible that a user will input a public key which is not
			listed in the system.
    */

    public_key: { type: 'string'},

    file_info: {type: 'json'},

    /*
    	approval_history is an array which would have something like this
			[
			{event :'pending', date: 128346t18634}
			{event :'locally_rejected', date: 128346t18634}
			{event :'submitted', date: 128346t18634}
			{event :'granting_approved', date: 128346t18634}
			{event :'granting_rejected', date: 128346t18634}
			]
    */

    approval_history: {type:'array'},

    data : { type: 'json', defaultsTo:{} },

    status: function(){
    	return (this.approval_history[approval_history.length-1].event);
    	/*
	    	if (this.granting_rejected) return 'granting_rejected';
	    	if (this.granting_approved) return 'granting_approved';
	    	if (this.locally_rejected) return 'locally_rejected';
	    	if (this.submitted) return 'submitted';
	    	return 'pending';
	   	*/
    },

  },


};

