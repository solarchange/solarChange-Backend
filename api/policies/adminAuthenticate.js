
module.exports = function(req, res, next) {

	console.log(req.body);

  var the_cb = function(err,result){
    if (err) return res.redirect('/');
    if (!result) return res.redirect('/');
    return next();
  };

  admin_auth_checker.authenticate(req.body.email, req.body.pass, the_cb);

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
