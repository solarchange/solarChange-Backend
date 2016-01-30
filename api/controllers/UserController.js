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


newUser: function(nu_user, initialSessionData, cb){

	var new_status = (nu_user.username && nu_user.firstName && nu_user.lastName && nu_user.email && nu_user.password) ? 'registered' : 'incomplete';

	var sesh = [initialSessionData];

	var the_new_user = {
		username:nu_user.username,
		firstName: nu_user.firstName,
		lastName: nu_user.lastName,
		email: nu_user.email,
		password: nu_user.password,
		status: new_status,
		sessionData = sesh
	};

	User.create(the_new_user).exec(function userCreated(err,created){
		if (err)
		{// HANDLE ERRORS
			cb(err);
			return err;
		}
		cb(null, created);
	});
},

updatePrime: function(userID,key,cb){
	User.update({id:userID},{primaryPK:key}).exec(function afterUpdate(err,updated){
		if (err)
		{	
			// HANDLE ERRORS
			cb(err);
			return err;
		}
		cb (null, updated);
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

