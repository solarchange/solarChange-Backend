var pageInitialized = false;

var lists = {};

lists.pending= [];
lists.locally_rejected = [];
lists.submitted = [];
lists.granting_approved = [];
lists.granting_rejected = [];
lists.non_filtered = [];
var current_list = 'non_filtered';

function set_socket_solars(){
	io.socket.get('/solar_device/admin_subscribe', function (resData) {
	  for (var i = 0 ; i<resData.length ; i++)
	  {
	  	// console.log(resData[i]);
	  	resData[i].status = get_status(resData[i]);
	  }

	  lists.non_filtered = resData;
	  lists.pending= _.where(resData,{status:'pending'});
	  lists.locally_rejected = _.where(resData,{status:'locally_rejected'});
	  lists.submitted = _.where(resData,{status:'submitted'});
	  lists.granting_approved = _.where(resData,{status:'granting_approved'});
	  lists.granting_rejected = _.where(resData,{status:'granting_rejected'});

	 list_items(lists.pending);
	 list_items(lists.locally_rejected);
	 list_items(lists.submitted);
	 list_items(lists.granting_approved);
	 list_items(lists.granting_rejected);
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

function filter_list(the_list, list_name){
	$('.solar_list_item').remove();
	list_items(the_list);
	current_list = list_name;
};

function list_items(the_list){
	console.log(the_list)
	for(i =0 ; i<the_list.length; i++)
	 {	
	 	insert_solar_device_into_table('#solar_device_table',the_list[i]);
	 	//
	 	insert_solar_device('#solar_device_list',the_list[i]);
	 }
};

function arrange_table(col){
	$('.solar_list_item').remove();
	console.log(col);
	for (var key in lists){
		if (!lists.hasOwnProperty(key)) continue;
		lists[key].sort(function(a,b){
			 // return a[col]-b[col]
			 var val1 = a[col];
			 var val2 = b[col];
			   //if (val1 == val2)
			   //    return 0;
			   if (val1 >= val2)
			       return 1;
			   if (val1 < val2)
			       return -1;
		});
	}
	console.log(lists[current_list][0])
	console.log(_.pluck(lists[current_list], col))
	list_items(lists[current_list]);
};

function arrange_by_key(){
	$('.solar_list_item').remove();
	for (var key in lists){
		if (!lists.hasOwnProperty(key)) continue;
		lists[key].sort(function(a,b){return a.public_key.key-b.public_key.key});
	}
	list_items(lists[current_list]);
};


function arrange_by_user(){
	$('.solar_list_item').remove();
	for (var key in lists){
		if (!lists.hasOwnProperty(key)) continue;
		lists[key].sort(function(a,b){return a.user.lastName-b.user.lastName});
	}
	list_items(lists[current_list]);
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

function reject(button){
	console.log('CLICK');
	io.socket.post( '/admin/reject',{solar_device_id:$(button).attr('data-id'), detail:$('#detail-'+$(button).attr('data-id')).val()}, function(resData, jwers){
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
	for(var i=0; i<lists.pending.length; i++)
	{
		io.socket.post('/admin/approve_solar',{solar_device_id:lists.pending[i].id},function(resData,jwers){
			granting_reaction(resData,jwers,lists.pending[i].id);
		});
	}
};

function granting_reaction(resData,jwers,solar_id){
	for (var key in lists){
		if (!lists.hasOwnProperty(key)) continue;
		change_entry_in_list(lists[key],resData[0],solar_id);
	}
	update_solar_device(resData[0]);
};

function change_entry_in_list(list,entry,id){
	for (var i=0 ; i<list.length ; i++){
		if (list[i].id==id){
			list[i]=entry;
			return list;
		}
	}
};


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

console.log('hasdfghfgskhbsfbkzdfbkdzfkbhdfgzkhbdvzbhk')

if (!device.user) return();

var location = '../granting/installation_file'+device.file_info.location.split('/proofFiles')[1];
	
	var the_key = '';
	if (device.public_key) the_key = device.public_key.key;
		
var solar_device = '<tr class="solar_list_item" id="solar-'+device.id+'">'+
'<td class="entry-info user-name">'+device.user.firstName+' '+device.user.lastName+'</td> '+
'<td class="entry-info owner-name">'+device.firstName+' '+device.lastName+'</td>'+
'<td class="entry-info inst-date">'+device.date_of_installation+'</td>'+
'<td class="entry-info address">'+device.address+'</td>'+
'<td class="entry-info city">'+device.city+'</td> '+
'<td class="entry-info state">'+device.state+'</td>'+
'<td class="entry-info country">'+device.country+'</td>'+
'<td class="entry-info nameplate">'+device.nameplate+'</td>'+
'<td class="entry-info nameplate">'+device.solar_angel_code+'</td>'+
'<td class="entry-info public_key">'+the_key+'</td>'+
//'+device.file_info.location+'
'<td class="entry-info file_location"><strong> <a href="'+location+'">Installation File</a> </strong></td>'+
//'<td><button class="solar_device_info file_button data-id="'+device.file_info.location+'" id="file-"'+device.id+'>Installation File"</button>'+
'<td class="entry-info device-status"><strong>'+device.status+'</strong></td>'+
'<td class="entry-info device-status"><strong>'+Date(device.approval_history[0].date)+'</strong></td>'+
'<td class="entry-info device-status"><strong>'+Date(device.approval_history[device.approval_history.length-1].date)+'</strong></td>'+
'<td><button data-id="'+device.id+'" id="approve'+device.id+'" class="approve solar-button" value="Approve And Submit" type="button" '+
approve_button_disable+'>Approve</button></td>'+
'<td><button data-id="'+device.id+'" id="reject'+device.id+'" class="reject solar-button" value="Reject" type="button" '+
reject_button_disable+'>Reject</button></td>'+
'<td><input data-id="'+device.id+'" id="detail-'+device.id+'" class="detail solar-button" value="" type="text" /></td>'+
	'</tr>';
	$(container).append(solar_device);

	$('#approve'+device.id).click(function(){
		approveNsubmit(this);
	});

	$('#reject'+device.id).click(function(){
		reject(this);
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

		$('.reject').click(function(){
			reject(this);
		});

		$('#pending-filter').click(function(){
			filter_list(lists.pending, 'pending');
		});

		$('#locally-rejected-filter').click(function(){
			filter_list(lists.locally_rejected, 'locally_rejected');
		});

		$('.normal-arrange').click(function(){
			arrange_table($(this).attr('data-arrange'));
		});

		$('#submitted-filter').click(function(){
			filter_list(lists.submitted, 'submitted');
		});


		$('#granting-approved-filter').click(function(){
			filter_list(lists.granting_approved, 'granting_approved');
		});


		$('#granting-rejected-filter').click(function(){
			filter_list(lists.granting_rejected, 'granting_rejected');
		});

		$('#all-filter').click(function(){
			
			filter_list(lists.non_filtered, 'non_filtered');
			// $('.solar_list_item').remove();
			// list_items(lists.non_filtered);
			// current_list = 'non_filtered';
		});

		$('#approveprove_all').click(function(){
			approveAll();
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







