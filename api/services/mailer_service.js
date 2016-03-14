var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

// username + password
var options = {
    auth: {
        api_user: sails.config.sendGrid.api_user,
        api_key: sails.config.sendGrid.api_key
    }
}

var mailer = nodemailer.createTransport(sgTransport(options));

module.exports = {


send_confirmation_mail:function(to,token){

var email_body = '<b>Confirm your registration by clicking on the following link:</b> <br/> http://52.27.201.224/html/#/activate/'+token;

var email = {
    to: to,
    from: 'uri.h.y.k@gmail.com',
    subject: 'Thank you for registering for SolarChange',
    text: 'Confirm your account at SolarChange',
    html: email_body,
};

mailer.sendMail(email, function(err, res) {
    if (err) { 
        console.log(err) 
    }
    console.log(res);
});


},


}