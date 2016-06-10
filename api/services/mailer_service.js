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

var act_link = email_details.base_url+'activate/'+token;

/*
    in the activatsion mail: $_USER_PRIVATE_NAME_$ , $_ACTIVASION_LINK_$
*/

var email_body = mailer_service.get_mail_form('assets/emails/activation.html');

email_body = email_body.replace('_USER_PRIVATE_NAME_', firstName);
email_body = email_body.replace('_ACTIVASION_LINK_', act_link);

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'Activate your SolarChange account!',
    text: 'Activate your SolarChange account!',
    html: email_body,
};

console.log('i am sending an email yo yo yo yoyyo '+to)

mailer.sendMail(email, function(err, res) {
    if (err) { 
        console.log(err) 
    }
    console.log(res);
});

},


solar_device_registration:function(to, device, wallet, user){

var email_body = mailer_service.get_mail_form('assets/emails/Solar_System_Submission.html');

email_body = email_body.replace('_USER_PRIVATE_NAME_',user.firstName);
email_body = email_body.replace('_SOLAR_OWNER_PRIVATE_NAME_',device.firstName);
email_body = email_body.replace('_SOLAR_OWNER_LAST_NAME_', device.lastName);
email_body = email_body.replace('_ADDRESS_',device.address);
email_body = email_body.replace('_CAPACITY_', device.nameplate);
email_body = email_body.replace('_INSTALLATION_DATE_', device.date_of_installation);
email_body = email_body.replace('_PUBLICKEY_', wallet.key);

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'We received your Solar System registration',
    text: 'We received your Solar System registration',
    html: email_body,
};

mailer.sendMail(email, function(err, res) {
    if (err) { 
        console.log(err) 
    }
    console.log(res);
});

},


rejection: function(to,userFirstName,reason){

    var email_body = mailer_service.get_mail_form('assets/emails/Solar_System_Declined.html');

    email_body = email_body.replace('_USER_PRIVATE_NAME_',userFirstName);
    email_body = email_body.replace('_REJECTION_REASON_',reason);


    var email = {
        to: to,
        from: 'do-not-reply@solarchange.co',
        subject: 'News from SolarChange',
        text: 'News from SolarChange',
        html: email_body,
    };

    mailer.sendMail(email, function(err, res) {
        if (err) { 
            console.log(err) 
        }
        console.log(res);
    });
},





system_approved: function(to, user, device){

    var email_body = mailer_service.get_mail_form('assets/emails/Solar_System_Approved.html');

email_body = email_body.replace('_USER_PRIVATE_NAME_',user.firstName);
email_body = email_body.replace('_SOLAR_OWNER_PRIVATE_NAME_',device.firstName);
email_body = email_body.replace('_SOLAR_OWNER_LAST_NAME_', device.lastName);
email_body = email_body.replace('_ADDRESS_',device.address);
email_body = email_body.replace('_CAPACITY_', device.nameplate);
email_body = email_body.replace('_INSTALLATION_DATE_', device.date_of_installation);
email_body = email_body.replace('_PUBLICKEY_',wallet.key);

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'We received your Solar System registration',
    text: 'We received your Solar System registration',
    html: email_body,
};

console.log(to)
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

send_recovery_mail: function(to,name, token){

 var email_body = mailer_service.get_mail_form('assets/emails/Recovery.html');
 var the_url = email_detail.base_url+'reset_password?token='+token+'&email='+to;

email_body = email_body.replace('_USER_PRIVATE_NAME_',name);
email_body = email_body.replace('_URL_',the_url);

var email = {
    to: to,
    from: 'do-not-reply@solarchange.co',
    subject: 'Reset password',
    text: 'Reset your password',
    html: email_body,
};

console.log(to)
mailer.sendMail(email, function(err, res) {
    if (err) { 
        console.log(err) 
    }
    console.log(res);
});

},


solar_device_submitted:function(to,device){

var email_body = mailer_service.get_mail_form('assets/emails/activation.html');

console.log('oooooooo----,,,,,')
console.log(device)

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

// http://staging.solarchange.co/activate?token=q5BD0jAyATgelBbApwu5tCyEwffNK77a

}