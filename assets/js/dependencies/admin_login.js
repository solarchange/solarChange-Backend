

$(document).ready(function(){

	$('#login-submit').click(function(){
		var da_cookie = 'email='+$('#email-login').val()+'; pass='+$('#pass-login').val()+';';
		document.cookie = da_cookie;
	});
}