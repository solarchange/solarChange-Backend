

$(document).ready(function(){

	$('#login-submit').click(function(){
		localStorage.setItem('email', $('#email-login').val());
		localStorage.setItem('pass', $('#pass-login').val());

	});
});