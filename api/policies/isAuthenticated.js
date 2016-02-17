module.exports = function(req, res, next) {

   	console.log('and the request is ')
   	console.log(req)


   if (req.isAuthenticated()) {

        return next();
    }
    else{


        return res.redirect('/login');
    }
};
