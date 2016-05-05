var pageInitialized = false;

org_list = [];

address_list=[];


function set_socket_known(){

	io.socket.get('/organization/get_orgs', function(resData){
		console.log(resData);
		for (var i =0; i<resData.length ; i++){
			insert_new_org(resData[i]);
		}
		make_org_list();
	});

	io.socket.get('/public_key/get_known', function (resData) {
	  for (var i = 0 ; i<resData.length ; i++)
	  {
	 	insert_new_address(resData[i]);
	  }
	});
};


function submit_new_org(){
	io.socket.post('/organization/add', {name:$('#new-org-name').val(), email:$('#new-org-email').val()},
		function(resData){
			if (resData.error) {
				alert(resData.err);
				return;
			}

			insert_new_org(resData);
			add_to_org_list(resData);
		});
};


function insert_new_org(new_org){
	console.log('NEW ORG')
	org_list.push({name:new_org.name, email:new_org.email});
	var entry = '<tr class="org-entry" id="org-'+new_org.name+'">'+
		+'<td>'+new_org.name+'</td>'
		+'<td>'+new_org.name+'</td>'
		+'<td>'+new_org.email+'</td>'
		+'<td><button data-org="'+new_org.name+'">Edit</button></td></tr>';
	$('#organization-table').append(entry);

};

function submit_new_address(){
	//console.log($('#new-known-org option:selected').val())
	
	io.socket.post('/public_key/add_known', {key:$('#new-known-key').val(), org:$('#new-known-org option:selected').val()}, function(resData){
		insert_new_address(resData);
	});
	
};

function make_org_list(){
	$('.org-chooser').html('');
	for (var i = 0 ; i<org_list.length ; i++)
	{
		$('.org-chooser').append('<option value="'+org_list[i].name+'">'+org_list[i].name+'</option>');
	}
};

function add_to_org_list(org_to_add) {
		$('.org-chooser').append('<option value="'+org_to_add.name+'">'+org_to_add.name+'</option>');
}


function insert_new_address(new_address){

	console.log(new_address);
	address_list.push({key:new_address.key,org:new_address.organization});
	
	var entry = '<tr class="address-entry" id="address-'+new_address.key+'">'
	+'<td>'+new_address.key+'</td>'
	+'<td>'+generate_selected_org_list(new_address.organization)+'</td>'
	+'<td><button class="address-submit">Submit</button></td>'
	+'</tr>';

	$('#known-address-table').append(entry);
};


function generate_selected_org_list(org){
	var da_list = '<select class="org-chooser">';

	console.log('--/>>>>>>>>>>>>>>>>>>>///')
	console.log(org)

	var the_name = org.name;
	if (!the_name) the_name = org;

	console.log(the_name);

	for (var i=0 ; i<org_list.length; i++){
		var selected = '';
		if (org_list[i].name==the_name) selected='selected';

		da_list = da_list+'<option value="'+org_list[i].name+'" '+selected+'>'+org_list[i].name+'</option>';
	}
	da_list = da_list+'</select>';

	return da_list;
};


$(document).ready(function(){

	if ($('#the-body').attr('data-page')!='known') return;

	//console.log(document.Session)
	if (!pageInitialized)
	{
		pageInitialized=true;

		set_socket_known();

		$('#new-org-submit').click(function(){
			submit_new_org();
		});

		$('#new-address-submit').click(function() {
			submit_new_address();
		})

	}
});

