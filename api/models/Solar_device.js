/**
* SolarDevice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

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

    public_key: { model: 'public_key', required: true},

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

    approval_history: {type:'array', defaultsTo:[{event :'pending', date:Date.now()}]},

    granting_responses: {type: 'array', defaultsTo:[]},

    granting_id: {type:'string'},

    affiliate: {type:'string'},

    data : { type: 'json', defaultsTo:{} },

    solar_angel_code: {type: 'string'},

    /*
            solar_grantings: [{coins_granted: 29,
                               energy_generated: 12,
                               period_start: 123445123341,
                               period_end: 1432736463,
                               date: 134563147}]
    */

    solar_grantings: {type:'array',defaultsTo:[]},

    monitoring_portal: {type: 'string', defaultsTo:null},

    monitoring_portal_username: {type:'string', defaultsTo:null},

    monitoring_portal_password: {type: 'string', defaultsTo:null},

    bulk_entry : {model:'bulk_entry', via:'solars'},

    from_bulk: {type:'boolean', defaultsTo:false},

    exported: {type: 'boolean', defaultsTo:false},


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

  beforeCreate: function (values, cb) {
    /*
    if (values.monitoring_portal_password)
    {
        bcrypt.hash(values.monitoring_portal_password, 10, function(err, hash) {
          if(err) return cb(err);
          values.password = hash;
          return cb();
        });
    }
    */
    return cb();
  }

};

