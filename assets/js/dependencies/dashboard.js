var pageInitialized = false;


function set_socket(){
	io.socket.get('/solar_device', function (resData) {
	  for (var i = 0 ; i<resData.length ; i++)
	  {
	  	console.log(resData[i]);
	  	resData[i].status = get_status(resData[i]);
	  }

	  console.log('i am here');

	 var pending_list= _.where(resData,{status:'pending'});

	 for (i = 0 ; i<pending_list.length ; i++)
	 {
	  	insert_solar_device('#solar_device_list',pending_list[i]);
	 }

	 for(i =0 ; i<resData.length; i++)
	 {	
	 	insert_solar_device('#solar_device_list',resData[i]);
	 }

		console.log('and now here')
	});

	io.socket.on('solar_device', function(event){
		switch(event.verb){
			case 'created':
				console.log(event);
				break;
		}

	});

/*
	$('.approve').click(function(){
		approveNsubmit(this);
	});
*/
};

function get_status(device){
	return device.approval_history[device.approval_history.length-1].event;
};

function approveNsubmit(button){
	console.log('CLICK');
	io.socket.post( '/admin/approve_solar',{solar_device_id:$(button).attr('data-id')}, function(resData, jwers){
		console.log(resData);
		console.log(jwers);
	});
};

function rejectLocally(button){

};

function insert_solar_device(container,device){

console.log('huhhhhhh');

var solar_device = '<li class="solar_list_item" id="solar-'+device.id+'"><div>'+
'<span class="solar_device_info"> <strong>User: </strong>'+device.user.firstName+' '+device.user.lastName+'</span> '+
'<span class="solar_device_info"><strong> Owner: </strong>'+device.firstName+' '+device.lastName+'</span> <br />'+
'<span class="solar_device_info"><strong> Installation Date: </strong>'+device.date_of_installation+'</span> <br />'+
'<span class="solar_device_info"><strong> Address Line: </strong>'+device.address+'</span>'+
'<span class="solar_device_info"><strong> City: </strong>'+device.city+'</span> '+
'<span class="solar_device_info"><strong> State: </strong>'+device.state+'</span>'+
'<span class="solar_device_info"><strong> City: </strong>'+device.city+'</span>'+
'<span class="solar_device_info"><strong> Zipcode: </strong>'+device.zipcode+'</span>'+
'<span class="solar_device_info"><strong> Country: </strong>'+device.country+'</span><br />'+
'<span class="solar_device_info"><strong> Nameplate: </strong>'+device.nameplate+'</span>'+
'<span class="solar_device_info"><strong> Wallet Address: </strong>'+device.public_key+'</span> <br />'+
'<span class="solar_device_info"><strong> <a href="'+device.file_info.fd+'">Installation File</a> </strong></span>'+
'<span class="solar_device_info"><strong> Status: </strong>'+device.status+'</span>'+
'</div><input data-id="'+device.id+'" id="approve'+device.id+'" class="approve solar-button" value="Approve And Submit" type="button" />'+
'</div><input data-id="'+device.id+'" id="reject'+device.id+'" class="reject solar-button" value="Reject" type="button" />'+
	'</li>';
	$(container).append(solar_device);

	$('#approve'+device.id).click(function(){
		approveNsubmit(this);
	});

	$('#reject'+device.id).click(function(){
		rejectLocally(this);
	});

};


$(document).ready(function(){
	console.log('whats gfoin on');
	if (!pageInitialized)
	{
		pageInitialized=true;

		set_socket();

		$('.approve').click(function(){
			approveNsubmit(this);
		});
	}
});







