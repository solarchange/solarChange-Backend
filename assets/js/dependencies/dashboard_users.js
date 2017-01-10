var pageInitialized = false;
function get_all_users(){
    io.socket.post('/user/list',{email:localStorage.email, password:localStorage.pass},function(resData){
        var users = resData.users;
        set_count_users('#users-count-label',users.length);
        set_count_users('#active-users-count-label',resData.active);
        if(users.length > 0){
            for(var i = 0;i<users.length;i++){
                insert_data_to_table('#users-table',users[i],i);
            }
        }
    });
}

function set_count_users(element,count){
    $(element).text(count);
}

function insert_data_to_table(element,data,i){
    i++;
    var table_data = '<tr class="user_list_item" id="user-'+data.id+'">'
        + '<td class="entry-info number">'+i+'</td>'
        + '<td class="entry-info firstName">'+data.firstName+'</td>'
        + '<td class="entry-info lastName">'+data.lastName+'</td>'
        + '<td class="entry-info email">'+data.email+'</td>'
        + '<td class="entry-info status">'+data.status+'</td>'
        + '<td class="entry-info from_bulk">'+data.from_bulk+'</td>'
        + '<td class="entry-info createdAt">'+ new Date(data.createdAt)+'</td>'
        + '<td class="entry-info createdAt">'+ new Date(data.updatedAt)+'</td>'
        + '</tr>';
    $(element).append(table_data);
}

$(document).ready(function(){
    if (!pageInitialized)
    {
        pageInitialized=true;
        get_all_users();
    }

});