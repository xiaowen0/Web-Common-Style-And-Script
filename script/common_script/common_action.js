/**
 * 
 * dependent on jQuery
 */

$(document).ready(function()
{
	// dialog
	$('.dialog').each(function(){
		$(this).find('.dialog_header .close_button').on('click', function(){
			var dialog = $(this).parents('.dialog');
			dialog.fadeOut();
		});
	});

    // backspace button action
    $('.backspaceButton').on('click', function(){
    	var inputGroup = $(this).parents('.inputGroup');
    	var inputbox = inputGroup.find('.inputbox');
    	var text = inputbox.val();
    	if (text.length<1)
		{
    		// nothing to do
    		return;
		}
    	text = text.substr(0, text.length - 1);
    	inputbox.val(text);
    });
    
});
