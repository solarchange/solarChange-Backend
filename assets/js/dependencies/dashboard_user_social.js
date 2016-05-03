
var pageInitialized = false;

user_list = [];

function set_socket_users(){
	io.socket.get('/user/admin_subscribe', function (resData) {
		user_list = resData;
	  for (var i = 0 ; i<resData.length ; i++)
	  {
	  	user_list[i].social_state = get_social_state(resData[i]);
	  	insert_user('#user_social_table',user_list[i]);
	  }
	});

	io.socket.on('user', function(event){

		console.log('yoooooo there was something here i think you should be yo yo yo yo oy')
		console.log(event);
	});
};

function get_social_state(the_user){
	//console.log('yoooooooooo')
	var social_state = {};
	social_state.facebook = 0;
	social_state.twitter = 0;
	social_state.linkedin = 0;
	for (var i=0; i<the_user.social_shares; i++){
		if (!social_state[the_user.social_shares[i].social_network]) social_state[the_user.social_shares[i].social_network.toLowerCase()]=1;
		else social_state[the_user.social_shares[i].social_network.toLowerCase()]++;
	}	
	return social_state;
};

function insert_user(container, user){
	console.log(user)
	var user_entry = '<tr class="user_entry" id="user-'+user.id+'">'+
	'<td class="entry-info user-name">'+user.firstName+' '+user.lastName+'</td>'+
	'<td class="entry-info email">'+user.email+'</td>'+
	'<td class="entry-info facebook">'+user.social_state.facebook+'</td>'+
	'<td class="entry-info twitter">'+user.social_state.twitter+'</td>'+
	'<td class="entry-info linkedin">'+user.social_state.linkedin+'</td>'+
	'<td class="entry-info solars">'+user.solar_devices.length+'</td>'+
	'<td class="entry-info public-keys">'+user.publicKeys.length+'</td>'+
	+'</tr>';
	$(container).append(user_entry);
};

function sort_social(column){
	$('#user_social_table').html('');
	function compare(a,b){
		return (a.social_state[column]-b.social_state[column]);
	}
	user_list.sort(compare);
	for (var i=0; i<user_list.length ; i++){
		insert_user('#user_social_table',user_list[i]);
	}
};

function sort_prop(column){
	$('#user_social_table').html('');
	function compare(a,b){
		return (a[column].length-b[column].length);
	}
	user_list.sort(compare);
	for (var i=0; i<user_list.length ; i++){
		insert_user('#user_social_table',user_list[i]);
	}
};


$(document).ready(function(){
	//console.log(document.Session)
	if (!pageInitialized)
	{
		pageInitialized=true;

		set_socket_users();

		$('#facebook-button').click(function(){
			sort_social('facebook');
		});

		$('#twitter-button').click(function(){
			sort_social('twitter');
		});

		$('#linkedin-button').click(function(){
			sort_social('linkedin');
		});
		
		$('#solars-button').click(function(){
			sort_prop('solar_devices');
		});
	
		$('#pk-button').click(function(){
			sort_prop('publicKeys');
		});
	}
});




















