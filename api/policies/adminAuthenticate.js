
module.exports = function(req, res, next) {

	console.log(req.body);

  var the_cb = function(err,result){
    if (err) return res.json('no');
    if (!result) return res.json('no');
    return next();
  };

  admin_auth_checker.authenticate(req.body.email, req.body.password, the_cb);

	/*
   if (req.isAuthenticated()) {
   	console.log('hoooooray fuck fuck')
        return next();
    }
    else{
        return res.redirect('/');
    }

    */
};
