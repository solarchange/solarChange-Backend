var pageInitialized = false;

var pending_list= [];
var locally_rejected_list = [];
var submitted_list = [];
var granting_approved_list = [];
var granting_rejected_list = [];

function set_socket(){
	io.socket.get('/solar_device', function (resData) {
	  for (var i = 0 ; i<resData.length ; i++)
	  {
	  	console.log(resData[i]);
	  	resData[i].status = get_status(resData[i]);
	  }

	  pending_list= _.where(resData,{status:'pending'});
	  locally_rejected_list = _.where(resData,{status:'locally_rejected'});
	  submitted_list = _.where(resData,{status:'submitted'});
	  granting_approved_list = _.where(resData,{status:'granting_approved'});
	  granting_rejected_list = _.where(resData,{status:'granting_rejected'});

	 list_items(pending_list);
	 list_items(locally_rejected_list);
	 list_items(submitted_list);
	 list_items(granting_approved_list);
	 list_items(granting_rejected_list)
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

function list_items(the_list){
	for(i =0 ; i<the_list.length; i++)
	 {	
	 	console.log('wait what');
	 	console.log(the_list[i]);
	 	insert_solar_device_into_table('#solar_device_table',the_list[i]);
	 	//
	 	insert_solar_device('#solar_device_list',the_list[i]);
	 }
};


function get_status(device){
	return device.approval_history[device.approval_history.length-1].event;
};

function approveNsubmit(button){
	console.log('CLICK');
	io.socket.post( '/admin/approve_solar',{solar_device_id:$(button).attr('data-id')}, function(resData, jwers){
		granting_reaction(resData,jwers,$(button).attr('data-id'));
	});
};

function rejectLocally(button){

};

function approveAll(){
	for(var i=0; i<pending_list.length; i++)
	{
		io.socket.post('/admin/approve_solar',{solar_device_id:pending_list[i].id},function(resData,jwers){
			granting_reaction(resData,jwers,pending_list[i].id);
		});
	}
};

function granting_reaction(resData,jwers,solar_id){
	console.log(resData);
	console.log(jwers);
}


function insert_solar_device(container,device){

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


function insert_solar_device_into_table(container,device){

console.log('this is the containiter')
console.log(container);

var solar_device = '<tr class="solar_list_item" id="solar-'+device.id+'">'+
'<td class="solar_device_info">'+device.user.firstName+' '+device.user.lastName+'</td> '+
'<td class="solar_device_info">'+device.firstName+' '+device.lastName+'</td>'+
'<td class="solar_device_info">'+device.date_of_installation+'</td>'+
'<td class="solar_device_info">'+device.address+'</td>'+
'<td class="solar_device_info">'+device.city+'</td> '+
'<td class="solar_device_info">'+device.state+'</td>'+
'<td class="solar_device_info">'+device.city+'</td>'+
'<td class="solar_device_info">'+device.zipcode+'</td>'+
'<td class="solar_device_info">'+device.country+'</td>'+
'<td class="solar_device_info">'+device.nameplate+'</td>'+
'<td class="solar_device_info">'+device.public_key+'</td>'+
'<td class="solar_device_info"><strong> <a href="'+device.file_info.fd+'">Installation File</a> </strong></td>'+
'<td class="solar_device_info"><strong> Status: </strong>'+device.status+'</td>'+
'<td><input data-id="'+device.id+'" id="approve'+device.id+'" class="approve solar-button" value="Approve And Submit" type="button" /></td>'+
'<td><input data-id="'+device.id+'" id="reject'+device.id+'" class="reject solar-button" value="Reject" type="button" /></td>'+
	'</tr>';
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
	console.log(document.Session)
	if (!pageInitialized)
	{
		pageInitialized=true;

		set_socket();

		$('.approve').click(function(){
			approveNsubmit(this);
		});
	}
});







