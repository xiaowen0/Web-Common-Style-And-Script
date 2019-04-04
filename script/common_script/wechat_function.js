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
        return false;
    }

    wx.ready(function ()
    {
        // wechat client 6.7.2+ & JSSDK 1.4.0+
        if (typeof(wx.updateAppMessageShareData) !== 'undefined')
        {
            wx.updateAppMessageShareData(options);
        }
        else
        {
            wx.onMenuShareAppMessage(options);
        }

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
        return false;
    }

    wx.ready(function ()
    {
        // wechat client 6.7.2+ & JSSDK 1.4.0+
        if (typeof(wx.updateAppMessageShareData) !== 'undefined')
        {
            wx.updateAppMessageShareData(options);
        }
        else
        {
            wx.onMenuShareQQ(options);
        }

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
            wx.onMenuShareQZone(options);
        }

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
        return false;
    }

    wx.ready(function ()
    {
        wx.onMenuShareWeibo(options);
    });

    return true;
}

