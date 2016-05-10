var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var fs = require("fs");

// username + password
var options = {
    auth: {
        api_user: sails.config.sendGrid.api_user,
        api_key: sails.config.sendGrid.api_key
    }
}

var mailer = nodemailer.createTransport(sgTransport(options));

module.exports = {

get_mail_form: function(fileName){
return fs.readFileSync(fileName,'utf8');
},


send_confirmation_mail:function(to,token,firstName){

var act_link = 'http://staging.solarchange.co/#/activate/'+token;

/*
    in the activatsion mail: $_USER_PRIVATE_NAME_$ , $_ACTIVASION_LINK_$
*/

var email_body = mailer_service.get_mail_form('assets/emails/activation.html');

email_body.replace('$_USER_PRIVATE_NAME_$', firstName);
email_body.replace('$_ACTIVASION_LINK_$', act_link);

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'Activate your SolarChange account!',
    text: 'Activate your SolarChange account!',
    html: email_body,
};

console.log('i am sending an email yo yo yo yoyyo')

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
var email_body = 'You have just registered a new solar device. yuhu';

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'New Solar Device Registered',
    text: 'Thank you for registering a new solar device',
    html: email_body,
};

mailer.sendMail(email, function(err, res) {
    if (err) { 
        console.log(err) 
    }
    console.log(res);
});

},

solar_device_submitted:function(to,device){

var email_body = 'cool solar device dude';

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'Solar Device Approved',
    text: 'Your Solar Device has been approved by SolarChange',
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