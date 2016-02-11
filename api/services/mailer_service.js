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
console.log('heya im here');
var email_body = '<b>Confirm your registration by clicking on the following link:</b> <br/> www.google.com/'+token;

var email = {
    to: to,
    from: 'uri.h.y.k@gmail.com',
    subject: 'Thank you for registering for SolarChange',
    text: 'Confirm your account at SolarChange',
    html: email_body,
};

console.log('just sent an email and all of that yo yo yo ');

mailer.sendMail(email, function(err, res) {
    if (err) { 
        console.log(err) 
    }
    console.log(res);
});


},




email_this:function(){

var email = {
    to: ['uri.h.y.k@gmail.com'],
    from: 'uri.h.y.k@gmail.com',
    subject: 'Hi there',
    text: 'Awesome sauce',
    html: '<b>Awesome sauce</b>'
};
console.log('alright');
mailer.sendMail(email, function(err, res) {
  console.log('sent?');
    if (err) { 
        console.log(err) 
    }
    console.log(res);
});

},


}