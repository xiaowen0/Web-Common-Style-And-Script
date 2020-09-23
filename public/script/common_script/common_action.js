/**
 * common action
 * recommend use single page app framework
 * It's use in non-single page
 * @author: Kevin Kwan
 * @requires jQuery common_function
 * E-mail: zhiwen2720@163.com
 * url: https://github.com/xiaowen0/Web-Common-Style-And-Script
 */

$(document).ready(function ()
{
    if ($(document.body).hasClass('fullHeight'))
    {
        setBodyMinHeight();
    }

    // check debug param
    var debugParam = getUrlParam('debug');
    if (debugParam)
    {
        enableDebug();
    }

    // check debug status
    if (getDebugStatus())
    {
        $('<div id="debugModeTag" class="f14r16">调试模式</div>').appendTo(document.body);
        $('.debugButtonLayer').removeClass('hide').show();
    }

    if (getUrlParam('vconsole'))
    {
        // VConsole
        if (typeof(VConsole) === 'undefined')
        {
            loadScript('https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js', {
                onload : function (){
                    window.vConsole = new VConsole();
                }
            });
        }
        else
        {
            window.vConsole = new VConsole();
        }
    }

    // test mode
    var testParam = getUrlParam('test');
    if (testParam)
    {
        $(document.body).addClass('testMode');
    }

    // init auto increase textarea
    $('textarea.autoIncreaseHeight').each(function()
    {
        setTextareaAutoIncreaseHeight(this);
    });

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

    // video player
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

    if ($('.qqMapContainer').length)
    {
        $('.qqMapContainer').each(function(){
            // qq map
            new qq.maps.Map(this, {
                center: new qq.maps.LatLng(23.027094,113.111318),
                zoom: 15
            });
        });
    }

    if ($('.treeView').length)
    {
        initTreeView('.treeView');
    }

    // setting button
    if ($('#settingIconContainer .settingButton').length)
    {
        $('#settingIconContainer .settingButton').on('click', function(){
            $('#UISettingDialog').fadeIn();
            adjustDialog('#UISettingDialog');
            centerDialog('#UISettingDialog');
        });
    }

    if ($('#UISettingForm').length)
    {
        initUISettingForm($('#UISettingForm')[0]);
    }

    // alice animation lib
    if (typeof (alice) === 'object')
    {
        var alicejs = alice.init(); //Is built right into alice!
    }

    // element slow swing, it rotate round-trip in x (default:5) deg range.
    var slowSwingElements = $('.slowSwing');
    if (typeof (alice) === 'object' && slowSwingElements.length)
    {
        slowSwingElements.each(function(){

            var rotate      = parseInt(this.dataset.rotate || '5');
            var duration    = this.dataset.duration || '2000ms';
            var timing      = this.dataset.timing || 'linear';
            var delay       = this.dataset.delay || '0ms';
            var iteration   = this.dataset.iteration || 'infinite';
            var direction   = this.dataset.direction || 'alternate';
            var playstate   = this.dataset.playstate || 'running';

            alicejs.dance({
                elems   : this,
                rotate  : rotate,
                duration: duration,
                timing  : timing,
                delay   : delay,
                iteration   : iteration,
                direction   : direction,
                playstate   : playstate
            });
        });
    }

    // element slow twinkle, it set opacity from n to 1 range transitional.
    var slowTwinkleElements = $('.slowTwinkle');
    if (typeof (alice) === 'object' && slowTwinkleElements.length)
    {
        slowTwinkleElements.each(function(){

            var element = this;

            var opacity = element.dataset.opacity || '.75';
            var speed   = parseInt(this.dataset.speed || '700');
            var delay   = parseInt(this.dataset.delay || '200');

            window.setInterval(function(){

                var type    = element.dataset.type || '1';
                if (type === "1")
                {
                    $(element).animate({
                        'opacity' : opacity
                    },  speed, 'swing').attr('data-type', '0');
                }
                else
                {
                    $(element).animate({
                        'opacity' : '1'
                    }, speed, 'swing').attr('data-type', '1');
                }
            }, speed + delay);
        });
    }

    // type Array
    var showTagCodeList = $('.showTagCode');
    if (showTagCodeList.length)
    {
        showTagCodeList.each(function(){
            var source = this.dataset.source || "";
            if (!source)
            {
                addConsoleLog('[warnning] data-source property not defined.');
                return;
            }

            var sourceTag = $(source);
            if (sourceTag.length < 1)
            {
                addConsoleLog('[warnning] source: ' + source + ' not found.');
                return;
            }

            var content = escapeFormatHtml(sourceTag[0].outerHTML);

            this.innerHTML = content;
        });
    }

    // response element
    var responseHandle = (function()
    {
        // screen direction
        (function()
        {
            $('.page').removeClass('landscape portrait').addClass(
                getWindowWidth() > getWindowHeight() ? 'landscape' : 'portrait'
            );
        })();

        // dynamic base font size for different screen size
        (function()
        {
            var baseWidth       = parseInt($('body').data('base-width'));
            var baseFontSize    = parseInt($('body').data('base-font-size')) || 10;
            if (!baseWidth)
            {
                return;
            }

            var windowWidth = getWindowWidth();
            if (!windowWidth)
            {
                addConsoleLog('get window width fail.');
                return;
            }

            var fontSize = windowWidth / baseWidth * baseFontSize;
            $('html').css('font-size', fontSize + 'px');
        })();

        // convert standard font size to percentage for some elements
        $('[data-standard-font-size]').each(function() {
            // @param   Number
            var fontSize = parseInt($(this).attr('data-standard-font-size'));
            if (!fontSize) { return; }

            // default font size or base font size
            var baseFontSize = parseInt($(document.body).css('font-size'));

            $(this).css('font-size', fontSize / baseFontSize * 100 + '%');
        });

        // response class element
        // html tag attr: data-size-ratio  Float  ratio (height:width)
        $('.response').each(function ()
        {
            // reset height
            $(this).css('height', 'auto');

            // get width and ratio, calculate height
            var width = this.offsetWidth;
            var ratio = parseFloat($(this).data('size-ratio') || $(this).data('ratio') || 0);
            var height = width * ratio;

            if ( getDebugStatus() && existDebuggingContent('response') )
            {
                addDebugLog('width=' + width);
                addDebugLog('ratio=' + ratio);
                addDebugLog('height=' + height);
            }

            // set new height
            $(this).css('height', height + 'px');
        });

        // adjust visible dialog
        $('.dialog:visible').each(function()
        {
            adjustDialog(this);
            centerDialog(this);
        });
    });
    responseHandle();
    $(window).on('resize', responseHandle);

});
