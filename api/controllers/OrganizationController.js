/**
 * OrganizationController
 *
 * @description :: Server-side logic for managing organizations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	add_new: function(req, res){
		Organization.create({name:req.body.name, email:req.body.email}).exec(function(err,created){
			if (err) return res.json(err);
			return res.json(created);
		});
	},

	get_and_subscribe : function(req, res){
	if (!req.isSocket) {
          return res.badRequest('Only a client socket can subscribe to Louies.  You, sir or madame, appear to be an HTTP request.');
      }

    Organization.find({}).populate('known_addresses').exec(function(err, found){
      if (err) return res.serverError(err);

      Organization.subscribe(req, _.pluck(found,'id'));
        return res.json(found);
    });
	},

	destroy_orgs : function(req, res){
		Organization.destroy({}).exec(function (err) {
			res.json('hahhahhahaha')
		})
	}
};

