/**
 * Mass_inputController
 *
 * @description :: Server-side logic for managing mass_inputs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var csv = require('csv');
var fs = require('fs');
var path = require('path');

module.exports = {
	

	read_mass_file:function(req, res){


		var the_file =  fs.readFileSync('docs/massEntries/'+req.body.file,'utf8');

		csv.parse(the_file, function(err, data){

			if (err) return res.json(err);

			return res.json(data);

		});
	},



};

