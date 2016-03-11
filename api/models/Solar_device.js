/**
* SolarDevice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    user : { model : 'user', required: true},

    firstName: {type:'string', required: true},

    lastName: {type:'string', required: true},

    date_of_installation: {type:'date', required: true},

    address : { type: 'string', required: true },

    city: { type: 'string', required: true },

    state: {type: 'string', required: true},

    zipcode: { type: 'string', required: true },

    country: { type: 'string', required: true },

    nameplate: { type: 'float', required: true },

    /*
			public_key here is NOT a model since it is possible that a user will input a public key which is not
			listed in the system.
    */

    public_key: { type: 'string', required: true},

    file_info: {type: 'json', required: true},

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

    granting_id: {type:'string'},

    affiliate: {type:'string'},

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

