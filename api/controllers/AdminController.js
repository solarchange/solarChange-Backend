/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	

	get_solar_devices:function(req,res){
		var cb = function(err,found){
			if (err) return res.json(err);
			return res.json(found);
		}
		sails.Controllers.solar_device({},cb);
	},


  /**
   * `AdminController.email()`
   */
  email: function (req, res) {
    return res.json({
      todo: 'email() is not implemented yet!'
    });
  }
};

