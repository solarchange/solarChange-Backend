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

var email_body = 'Thank you for signing up to SolarChange. <br /> By Joining SolarChange, you are promoting the world towards a more sustainable future! <br/><br/> '+
'<b> To activate your account, please click on the link below:</b> <br/> http://52.27.201.224/html/#/activate/'+token;+'<br/><br/>'+
'Thank you for being part of the solar revolution,<br/>'+
'The SolarChange team<br/>----<br/>Please do not reply to this email, we will be happy to hear from you here: www.solarchange.co';

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'SolarChange: Verify your email address',
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


send_activation_mail:function(to, name){
var email_body = 'Welcome to SolarChange, '+name;

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'Welcome to SolarChange',
    text: 'Welcome to SolarChange',
    html: email_body,
};

mailer.sendMail(email, function(err, res) {
    if (err) { 
        console.log(err) 
    }
    console.log(res);
});

},


solar_device_registration:function(to, device){
var email_body = 'Welcome to SolarChange, '+name;

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'Welcome to SolarChange',
    text: 'Welcome to SolarChange',
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