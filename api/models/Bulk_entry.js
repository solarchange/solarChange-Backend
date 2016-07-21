/**
* Bulk_entry.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	solars: {collection:'solar_device', via:'bulk_entry'},

  	initial_solars: {type:'array'},

  	done_solars: {type:'array'},

  	status: {type:'string', defaultsTo:''},

  	report_recievers: {type: 'json'},

  	affiliate: {type:'string'},

  	path_to_input_file: {type:'string'},

  	data_name: {type:'string'},

  	path_to_output_file: {type: 'string'}

  }
};

