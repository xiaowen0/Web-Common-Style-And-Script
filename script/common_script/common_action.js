/**
 * 
 * dependent on jQuery
 */

$(document).ready(function()
{
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
