var pageInitialized = false;

var pending_list= [];
var locally_rejected_list = [];
var submitted_list = [];
var granting_approved_list = [];
var granting_rejected_list = [];

function set_socket_solars(){
	io.socket.get('/solar_device/admin_subscribe', function (resData) {
	  for (var i = 0 ; i<resData.length ; i++)
	  {
	  	//console.log(resData[i]);
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
	 list_items(granting_rejected_list);
	});

	io.socket.on('solar_device', function(event){

		console.log('yoooooo there was something here i think you should be yo yo yo yo oy')
		console.log(event);

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

function filter_list(the_list){
	$('.solar_list_item').remove();
	list_items(the_list);
};

function list_items(the_list){
	for(i =0 ; i<the_list.length; i++)
	 {	
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

function get_file(button){
	io.socket.post( '/admin/get_file',{file:$(button).attr('data-id')}, function(resData, jwers){
		have_file(resData,jwers);
	});
};

function have_file(resData,jwers){
	console.log(resData);
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
	console.log('hahahahahahahahahahhahahsahahahah - zongo')
	console.log(resData[0]);
	update_solar_device(resData[0])
}

function update_solar_device(device){
	device.status = device.approval_history[device.approval_history.length-1].event;
	var entry = $('#solar-'+device.id);
	entry.find('.user-name').html(device.user.firstName+' '+device.user.lastName);
	entry.find('.owner-name').html(device.firstName+' '+device.lastName);
	entry.find('.inst-date').html(device.date_of_installation);
	entry.find('.address').html(device.address);
	entry.find('.city').html(device.city);
	entry.find('.state').html(device.state);
	entry.find('.country').html(device.country);
	entry.find('.nameplate').html(device.nameplate);
	entry.find('.public_key').html(device.public_key.key);
	entry.find('.device-status').html('<strong>'+device.status+'</strong>');

	switch(device.status){
	case 'pending':
		entry.find('.approve').prop('disabled',false);
		entry.find('.reject').prop('disabled', false);
		break;
	case 'rejected':
		entry.find('.approve').prop('disabled',false);
		break;
	default:
		entry.find('.approve').prop('disabled',true);
		entry.find('.reject').prop('disabled', true);
	}

};

function insert_solar_device_into_table(container,device){

var approve_button_disable='disabled';
var reject_button_disable='disabled';
switch(device.status){
	case 'pending':
		approve_button_disable='';
		reject_button_disable='';
		break;
	case 'rejected':
		approve_button_disable='';
		break;
}

var location = device.file_info.location.split('/assets')[1];
	console.log('ooooooo')
	console.log(device)
	var the_key = device.public_key.key;
	if (!the_key) the_key='';

var solar_device = '<tr class="solar_list_item" id="solar-'+device.id+'">'+
'<td class="entry-info user-name">'+device.user.firstName+' '+device.user.lastName+'</td> '+
'<td class="entry-info owner-name">'+device.firstName+' '+device.lastName+'</td>'+
'<td class="entry-info inst-date">'+device.date_of_installation+'</td>'+
'<td class="entry-info address">'+device.address+'</td>'+
'<td class="entry-info city">'+device.city+'</td> '+
'<td class="entry-info state">'+device.state+'</td>'+
'<td class="entry-info country">'+device.country+'</td>'+
'<td class="entry-info nameplate">'+device.nameplate+'</td>'+
'<td class="entry-info public_key">'+the_key+'</td>'+
//'+device.file_info.location+'
'<td class="entry-info file_location"><strong> <a href="'+location+'">Installation File</a> </strong></td>'+
//'<td><button class="solar_device_info file_button data-id="'+device.file_info.location+'" id="file-"'+device.id+'>Installation File"</button>'+
'<td class="entry-info device-status"><strong>'+device.status+'</strong></td>'+
'<td><button data-id="'+device.id+'" id="approve'+device.id+'" class="approve solar-button" value="Approve And Submit" type="button" '+
approve_button_disable+'>Approve</button></td>'+
'<td><button data-id="'+device.id+'" id="reject'+device.id+'" class="reject solar-button" value="Reject" type="button" '+
reject_button_disable+'>Reject</button></td>'+
	'</tr>';
	$(container).append(solar_device);

	$('#approve'+device.id).click(function(){
		approveNsubmit(this);
	});

	$('#reject'+device.id).click(function(){
		rejectLocally(this);
	});

	$('#file-'+device.id).click(function(){
		get_file(this);
	});

};




$(document).ready(function(){
	console.log('whats gfoin on');

	if ($('#the-body').attr('data-page')!='solar') return;

	//console.log(document.Session)
	if (!pageInitialized)
	{
		pageInitialized=true;

		set_socket_solars();

		$('.approve').click(function(){
			approveNsubmit(this);
		});

		$('#pending-filter').click(function(){
			filter_list(pending_list);
		});

		$('#locally-rejected-filter').click(function(){
			filter_list(locally_rejected_list);
		});


		$('#submitted-filter').click(function(){
			filter_list(submitted_list);
		});


		$('#granting-approved-filter').click(function(){
			filter_list(granting_approved_list);
		});


		$('#granting-rejected-filter').click(function(){
			filter_list(granting_rejected_list);
		});

		$('#all-filter').click(function(){
			$('.solar_list_item').remove();
			list_items(pending_list);
			list_items(locally_rejected_list);
	 		list_items(submitted_list);
			list_items(granting_approved_list);
			list_items(granting_rejected_list);
		});
	}
});






// ------- Not used anymore



function insert_solar_device(container,device){

var solar_device = '<li class="solar_list_item" id="solar-'+device.id+'"><div>'+
'<span class="solar_device_info"> <strong>User: </strong>'+device.user.firstName+' '+device.user.lastName+'</span> '+
'<span class="solar_device_info"><strong> Owner: </strong>'+device.firstName+' '+device.lastName+'</span> <br />'+
'<span class="solar_device_info"><strong> Installation Date: </strong>'+device.date_of_installation+'</span> <br />'+
'<span class="solar_device_info"><strong> Address Line: </strong>'+device.address+'</span>'+
'<span class="solar_device_info"><strong> City: </strong>'+device.city+'</span> '+
'<span class="solar_device_info"><strong> State: </strong>'+device.state+'</span>'+
'<span class="solar_device_info"><strong> Country: </strong>'+device.city+'</span>'+
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







