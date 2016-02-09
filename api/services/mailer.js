var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

// username + password
var options = {
    auth: {
        api_user: 'uriyk',
        api_key: 'safetyfirst1'
    }
}

var mailer = nodemailer.createTransport(sgTransport(options));

module.exports = {

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