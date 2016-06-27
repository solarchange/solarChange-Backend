

$(document).ready(function(){

	$('#login-submit').click(function(){
		console.log('jaooooooooooooo')
		//var da_cookie = 'email='+$('#email-login').val()+'; pass='+$('#pass-login').val()+';';

		//document.cookie = da_cookie;

		localStorage.setItem('email', $('email-login').val());
		localStorage.setItem('pass', $('pass-login').val());

	});
});