/**
 * common action
 * dependent on jQuery
 */

$(document).ready(function ()
{
    var debugParam = getUrlParam('debug');
    if (debugParam)
    {
        $('<div id="debugModeTag">调试模式</div>').appendTo(document.body);
    }

    // init checkbox action to check all children
    $('.checkAllChildren').each(function()
    {
        setCheckAllChildrenAction(this);
    });

    // set music control button action to toggle music play status
    $('#mainMusicControlButton').on('click', function ()
    {
        toggleMusic();
    });

    // button action to show layer
    $('.showLayer').on('click', function ()
    {
        var target = $(this).data('target');
        if (!target) {
            return;
        }
        $(target).fadeIn();
    });

    // initialize dialog action
    initDialogAction();

    // backspace button action
    $('.backspaceButton').on('click', function ()
    {
        var inputGroup = $(this).parents('.inputGroup');
        var inputbox = inputGroup.find('.inputbox');
        var text = inputbox.val();
        if (text.length < 1) {
            // nothing to do
            return;
        }
        text = text.substr(0, text.length - 1);
        inputbox.val(text);
    });

    // set auto page down
    $('.autoPageDown').each(function ()
    {
        setAutoPageDown(this, 10);
    });
    if( $('.takeTurnDisplayImage').length >=1 )
    {
        $('.takeTurnDisplayImage').each(function(){
            setTakeTurnDisplayImage(this);
        });
    }

    $('.videoPlayer .playButton').on('click', function()
    {
        var videoPlayer     = $(this).parents('.videoPlayer');
        var videoController = videoPlayer.find('.videoController');

        if (!videoController.length)
        {
            return;
        }

        try
        {
            videoController[0].play();
        }
        catch (e)
        {
            addConsoleLog(e);
        }
    });

    $('.videoPlayer .pauseButton').on('click', function()
    {
        var videoPlayer     = $(this).parents('.videoPlayer');
        var videoController = videoPlayer.find('.videoController');

        if (!videoController.length)
        {
            return;
        }

        try
        {
            videoController[0].pause();
        }
        catch (e)
        {
            addConsoleLog(e);
        }
    });

    $('.videoPlayer .fullScreenButton').on('click', function()
    {
        var videoPlayer     = $(this).parents('.videoPlayer');
        var videoController = videoPlayer.find('.videoController');

        if (!videoController.length)
        {
            return;
        }

        videoController = videoController[0];

        setFullScreenVideo(videoController);
    });

    $('.videoController').on('dblclick', function(){
        setFullScreenVideo(this);
    });

    // load external html
    $('[data-html-src]').each(function()
    {
        var src = $(this).data('html-src');
        if (!src)
        {
            return;
        }
        loadHtml(src + '.html', this);
    });

    // response element
    var responseHandle = (function()
    {
        $('.response').each(function ()
        {
            // reset height
            $(this).css('height', 'auto');

            // get width and ratio, calculate height
            var width = this.offsetWidth;
            addDebugLog('width=' + width);
            var ratio = parseFloat($(this).data('size-ratio') || $(this).data('ratio') || 0);
            addDebugLog('ratio=' + ratio);
            var height = width * ratio;
            addDebugLog('height=' + height);

            // set new height
            $(this).css('height', height + 'px');
        });
    });
    responseHandle();
    $(window).on('resize', responseHandle);

});
