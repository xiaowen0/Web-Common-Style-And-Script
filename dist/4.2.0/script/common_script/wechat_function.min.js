/**
 * some function for wechat page using JSSDK
 */

function setWechatReady()
{
    if (typeof(wx) === 'undefined')
    {
        return false;
    }
}

/**
 * set share options for wechat's timeline share
 * @param options   Object
 * @returns {boolean}
 */
function setWechatTimelineShare(options)
{
    if (typeof(wx) === 'undefined')
    {
        addConsoleLog('Require wechat jssdk: wx not defined.');
        return false;
    }

    wx.ready(function ()
    {
        // wechat client 6.7.2+ & JSSDK 1.4.0+
        if (typeof(wx.updateTimelineShareData) !== 'undefined')
        {
            wx.updateTimelineShareData(options);
        }
        else
        {
            wx.onMenuShareTimeline(options);
        }

    });

    return true;
}

/**
 * set share options for wechat's message
 * @param options   Object
 * @returns {boolean}
 */
function setWechatMessageShare(options)
{
    if (typeof(wx) === 'undefined')
    {
        addConsoleLog('Require wechat jssdk: wx not defined.');
        return false;
    }

    wx.ready(function ()
    {
        // wechat client 6.7.2+ & JSSDK 1.4.0+
        if (typeof(wx.updateAppMessageShareData) !== 'undefined')
        {
            log('wx.updateAppMessageShareData:');
            wx.updateAppMessageShareData(options);
        }
        else
        {
            log('wx.onMenuShareAppMessage:');
            wx.onMenuShareAppMessage(options);
        }

        log(options);
    });

    return true;
}

/**
 * set share options for QQ
 * @param options   Object
 * @returns {boolean}
 */
function setQQShare(options)
{
    if (typeof(wx) === 'undefined')
    {
        addConsoleLog('Require wechat jssdk: wx not defined.');
        return false;
    }

    wx.ready(function ()
    {
        // wechat client 6.7.2+ & JSSDK 1.4.0+
        if (typeof(wx.updateAppMessageShareData) !== 'undefined')
        {
            log('wx.updateAppMessageShareData():');
            wx.updateAppMessageShareData(options);
        }
        else
        {
            log('wx.onMenuShareQQ():');
            wx.onMenuShareQQ(options);
        }

        log(options);
    });

    return true;
}

/**
 * set share options for QQ
 * @param options   Object
 * @returns {boolean}
 */
function setQZoneShare(options)
{
    if (typeof(wx) === 'undefined')
    {
        addConsoleLog('Require wechat jssdk: wx not defined.');
        return false;
    }

    wx.ready(function ()
    {
        // wechat client 6.7.2+ & JSSDK 1.4.0+
        if (typeof(wx.updateTimelineShareData) !== 'undefined')
        {
            log('wx.updateTimelineShareData():');
            wx.updateTimelineShareData(options);
        }
        else
        {
            log('wx.onMenuShareQZone():');
            wx.onMenuShareQZone(options);
        }

        log(options);
    });

    return true;
}

/**
 * set share options for QQ weibo
 * @param options   Object
 * @returns {boolean}
 */
function setWeiboShare(options)
{
    if (typeof(wx) === 'undefined')
    {
        addConsoleLog('Require wechat jssdk: wx not defined.');
        return false;
    }

    wx.ready(function ()
    {
        log('wx.onMenuShareWeibo():');
        wx.onMenuShareWeibo(options);
        log(options);
    });

    return true;
}

