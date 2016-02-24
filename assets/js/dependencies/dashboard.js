
function set_socket(){
	io.socket.get('/solar_device', function (resData) {
	  for (var i = 0 ; i<resData.length ; i++)
	  {
	  	console.log(resData[i]);
	  	
	  }
	});

	io.socket.on('solar_device', function(event){
		switch(event.verb){
			case 'created':
				console.log(event);
				break;
		}

	});

};

function insert_solar_device(device){

var solar_device = '<li class="solar_list_item" id="solar-'+device.id+'"><div>'+
'<span class="solar_device_info"> <strong>User:</strong>'+device.user.firstName+' '+device.user.lastName+'</span> '+
'<span class="solar_device_info"><strong> Owner: </strong>'+device.firstName+' '+device.lastName+'</span>'+
'<span class="solar_device_info"><strong> Installation Date: </strong>'+device.date_of_installation+'</span>'+
'<span class="solar_device_info"><strong> Address Line: </strong>'+device.address+'</span>'+
'<span class="solar_device_info"><strong> City: </strong>'+device.city+'</span>'+
'<span class="solar_device_info"><strong> State: </strong>'+device.state+'</span>'+
'<span class="solar_device_info"><strong> City: </strong>'+device.city+'</span>'+
'<span class="solar_device_info"><strong> Zipcode: </strong>'+device.zipcode+'</span>'+
'<span class="solar_device_info"><strong> Country: </strong>'+device.country+'</span>'+
'<span class="solar_device_info"><strong> Nameplate: </strong>'+device.nameplate+'</span>'+
'<span class="solar_device_info"><strong> Wallet Address: </strong>'+device.public_key+'</span>'+
'<span class="solar_device_info"><strong> <a href="'+device.file_info.fd+'">Installation File</a> </strong></span>'+
'</div><input data-id="'+device.id+'" type="button">'+
	'</li>';

};


$(document).ready(function(){
set_socket();
});