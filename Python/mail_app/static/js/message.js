
$('input[type="checkbox"]').change(function(event) {
	if ($('input[type="checkbox"]:checked').length == 1) {
        $('#id_mark_btn').removeAttr('disabled');
    } 
    else if ($('input[type="checkbox"]:checked').length == 0 || $('input[type="checkbox"]:checked').length >1) {
        $('#id_mark_btn').attr('disabled', 'disabled');
    }	
});

function mark_as_message(){
    var message_id = $('input[type="checkbox"]:checked').val()
	$.ajax({
        url: '/mark_as_read_or_unread/',
        method:'POST',
        data: {
          'message_id': message_id
        },
        dataType: 'text',
        success: function (data) {
        	if (data){
        		window.location = '/dashboard/inbox_messages/'
        	}
        }
  	});
}


