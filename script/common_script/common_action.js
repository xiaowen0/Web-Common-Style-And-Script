/**
 * common action
 * dependent on jQuery
 */

$(document).ready(function()
{
	// show layer
	$('.showLayer').on('click', function()
	{
		var target = $(this).data('target');
		if (!target)
		{
			return;
		}
		
		$(target).fadeIn();
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
