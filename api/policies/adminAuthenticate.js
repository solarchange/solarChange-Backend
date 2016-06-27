

module.exports = function(req, res, next) {

	console.log(req.headers);
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
