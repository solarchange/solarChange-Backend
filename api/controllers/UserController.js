/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	getUserByID: function(eyed,cb){
		User.findOne({id:eyed}, function(err,found){
			if (err)
			{
				// HANDLE ERROR
				cb(err)
			}
			cb(null,found);
		});
	},


  /**
   * `UserController.get_user()`
   */
  get_user: function (req, res) {
    return res.json({
      todo: 'get_user() is not implemented yet!'
    });
  }
};

