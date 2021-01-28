function user_active(user_id) {
	$.ajax({
        url: '/user_active_deactive/',
        method:'POST',
        data: {
          'user_id': user_id
        },
        dataType: 'text',
        success: function (data) {
        	if (data){
        		window.location = '/dashboard/users_list/'
        	}
        }
  	});
}

setTimeout(function(){ 
    document.getElementById("message_container").style.display = "none"; 
}, 5000);

function delete_user(user_id,is_superuser) {
	$.ajax({
        url: '/dashboard/delete_user/',
        method:'POST',
        data: {
          'user_id': user_id,
        },
        dataType: 'text',
        success: function (data) {
        	if (data){
                if (is_superuser == true){
                    window.location = '/dashboard/users_list/'
                }
                else{
                    window.location = '/'
                }
        	}
        }
  	});
}


