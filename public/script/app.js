/**
 * app config
 * only setting some params and methods.
 * @type    Object
 */
var appConfig = {

    title : 'Kevin App Framework',

    name : 'Kevin App Framework',

    resourceList : [],

    apiList : {},

    loadWechatJSSDKConfigUrl : '',

    /**
     * environment config
     * @type Array  list of environment item
     */
    envList : [{
        id : 'dev',
        domain : 'localhost',
        apiDomain : 'localhost',
        apiBaseUrl : '/'
    }, {
        id : 'beta',
        domain : 'test.xx.com',
        apiDomain : 'test.xx.com',
        apiBaseUrl : 'test.xx.com/api/'
    }, {
        id : 'dist',
        domain : 'www.xx.com',
        apiDomain : 'api.xx.com',
        apiBaseUrl : 'api.xx.com/api/'
    }],

    /**
     * api domain.
     */
    apiDomain : '',

    /**
     * api base url, prefix of api url.
     */
    apiBaseUrl : '/',

    /**
     * sub page containner selector expression
     */
    subPageContainner : '#main_content_container',

    sound : {
        message : 'media/message.mp3',
            'delete' : 'media/delete.mp3',
            logon : 'media/logon.mp3',
            navigation : 'media/navigation.mp3',
    },

    /**
     * ajax error handle
     */
    ajaxErrorHandle : (function(XMLHttpRequest, errorText)
    {
        var status      = XMLHttpRequest.status;
        var statusText  = XMLHttpRequest.statusText;
        var responseText = XMLHttpRequest.responseText;

        var errorMessage = '';

        if (typeof(getDebugStatus) == 'function' && getDebugStatus())
        {
            errorMessage = 'Status code: ' + status + ' ' + statusText;
            app.showMessageBox(errorMessage, '出错了');
            if ( $('#debugInfoDialog').length )
            {
                var info = '<p>' + errorMessage + '</p>';
                $('#debugInfoDialog .infoContainer').append(info);
                var info = '<p>' + responseText + '</p>';
                $('#debugInfoDialog .infoContainer').append(info);
            }
        }
        else
        {
            if (status >= 500 && status < 600)
            {
                errorMessage = errorMessageList.InternalServerError;
            }
            else if (status === 408)     // 408 Request Timeout
            {
                errorMessage = errorMessageList.RequestTimeout;
            }
            else if (status === 409)     // 409 Conflict
            {
                errorMessage = errorMessageList.RequestConflict;
            }
            else
            {
                errorMessage = errorMessageList.defaultText;
            }

            app.showMessageBox(errorMessage, '失败');
        }

    }),

    /**
     * ajax error handle, only log to console.
     */
    ajaxErrorLogHandle : (function(XMLHttpRequest, errorText)
    {
        var status      = XMLHttpRequest.status;
        var statusText  = XMLHttpRequest.statusText;
        var responseText = XMLHttpRequest.responseText;

        var errorMessage = 'Status code: ' + status + ' ' + statusText;
        addConsoleLog(errorMessage, '出错了');
    }),

    fancyboxOptions : {
        iframe : {
            css : {
                width : '90%',
                height : '90%'
            }
        }
    },

    lightboxOption : {
        alwaysShowNavOnTouchDevices : true,
        albumLabel : "%1/%2"
    }

};
if (typeof(apiList) !== 'undefined')
{
    appConfig.apiList = apiList;
}

/**
 * web client application object
 * use in non-single page app framework, or copy to single page app framework.
 * methods recommend platform independent (not use BOM, DOM, Browser API)
 * @type    Object
 * @require jQuery, errorMessageList.js, common_function.js
 */
var application = {

    /**
     * app title
     * @type  String
     */
    title : '',

    /**
     * app config
     * @type  Object
     */
    config : {},

    /**
     * app mode
     * @type  String    dev|demo|testing
     */
    mode : '',

    /**
     * environment sign
     * @type    String
     */
    env : 'dev',

    /**
     * App base url
     * @type    String
     */
    baseUrl : '/',

    /**
     * API base url
     * @type    String
     */
    apiBaseUrl : '/',

    /**
     * init status
     */
    status : '',

    /**
     * resource list
     * @type    Array
     */
    resourceList : [],

    /**
     * sub page source url, if use div or iframe to load external page (html)
     */
    subPageUrl : '',

    /**
     * sub page containner selector expression
     */
    subPageContainner : '',

    // store current main panel's url
    current : '',

    /**
     * panel params
     * @type Object
     */
    panelParams : {},

    /**
     * sub page params
     * @type Object
     */
    subPageParams : {},

    /**
     * store api list
     * @type Object
     */
    apiList : {},

    soundPlayer : document.createElement('audio'),

    /**
     * @var object|null
     */
    user : null,

    sessionManager : null,

    init : function (config)
    {
        if (this.status == 'ready')
        {
            return true;
        }

        this.title = appConfig.title || '';
        this.name = appConfig.name || '';
        this.config = appConfig || {};
        this.apiList = this.config.apiList || {};

        this.checkEnvironment(this.config.envList || []);
        this.initResources(this.config.resourceList || []);

        // reset sound player
        this.soundPlayer.volume = 1;
        this.soundPlayer.autoplay = false;
        this.soundPlayer.defaultMuted = false;
        this.soundPlayer.error = (function(mediaError){
            addConsoleLog('sound player has a error:');
            addConsoleLog(mediaError);
        });

        this.status = 'ready';
    },

    /**
     * check environment
     * @param    Array    envList
     */
    checkEnvironment : function (envList)
    {
        var hostname = location.hostname;

        for (var i=0; i<envList.length; i++)
        {
            if (envList[i].domain == hostname)
            {
                this.env        = envList[i].id;
                this.baseUrl    = envList[i].baseUrl;
                this.apiDomain  = envList[i].apiDomain;
                this.apiBaseUrl = envList[i].apiBaseUrl;
                return;
            }
        }
    },

    checkLogin : function () {},

    enableDebug : function () {
        if (typeof (localStorage) === 'undefined')
        {
            return false;
        }
        localStorage.debug='on';
        sessionStorage.debug='on';
        return true;
    },
    disableDebug : function () {
        if (typeof (localStorage) === 'undefined')
        {
            return false;
        }
        localStorage.debug='off';
        sessionStorage.debug='off';
        return true;
    },
    getDebugStatus : function () {
        if (typeof (localStorage) === 'undefined')
        {
            return false;
        }
        return localStorage.debug == 'on';
    },


    getUser : function () {
        return this.user;
    },

    getAppIcon : function () {
        var iconLinkTag = document.getElementsByName('icon');
        if (!iconLinkTag.length)
        {
            return '';
        }
        return iconLinkTag[0].href;
    },

    goToLoginPage : function () {},

    /**
     * init resource list
     * @param    Array    resourceList
     */
    initResources : function (resourceList)
    {
        // clean resource record
        this.resourceList = [];

        // collect link tags
        var linkList = document.getElementsByTagName('link');
        for (var i=0; i<linkList.length; i++)
        {
            this.resourceList.push(linkList[i].href);
        }

        // collect script tags
        var scriptList = document.getElementsByTagName('script');
        for (var i=0; i<scriptList.length; i++)
        {
            this.resourceList.push(scriptList[i].src);
        }

        // load resources from config
        for (var i=0; i<resourceList.length; i++)
        {
            this.import(resourceList[i]);
        }
    },

    /**
     * import a resource
     * @param  String  url
     */
    import : function (url)
    {
        var fileName = getUrlFileName(url);

        // check if ready import
        for (var i=0; i<this.resourceList.length; i++)
        {
            var tFilename = getUrlFileName(this.resourceList[i]);
            if (fileName === tFilename)
            {
                return;
            }
        }

        // record and avoid repeat import
        // this.resourceList.push(url);
        if (isCSSFile(url))
        {
            this.resourceList.push(loadStylesheet(url));
        }
        else if (isScriptFile(url))
        {
            this.resourceList.push(loadScript(url));
        }
    },

    /**
     * show hint, and fade out after 2s
     * @param text
     */
    showHint : function (text, options) {

        typeof (options) == 'undefined' ? options = {} : null;
        var delay = options.delay || 2;

        var e = createElement('div', {
            'class' : 'hintBox'
        }, text);
        document.body.appendChild(e);
        var width   = e.offsetWidth;
        var height  = e.offsetHeight;
        e.style.marginLeft  = '-' + (width / 2) + 'px';
        e.style.marginTop   = '-' + (height / 2) + 'px';
        e.style.opacity = 1;

        window.setTimeout(function(){
            e.parentNode.removeChild(e);
        }, delay * 1000);
    },

    /**
     * show message use messagebox
     * @param  String  content
     * @param  String  title
     * @param  Object  options
     */
    showMessageBox : function (content, title, options){
        if (typeof(dialog) !== 'undefined')
        {
            dialog.msg(content);
        }
        else
        {
            alert(content);
        }
    },

    showMessage : function (content, title, options) {
        this.showMessageBox();
    },

    confirm : function () {},

    /**
     * load city data (include province, city, district)
     * @param  Function  callback(data, error)
     * - data  Object|null  object if success
     * - error Object|null  object if error
     */
    loadCityData : function (callback){
        $.ajax({
            url : '../../data/cities.json',
            dataType : 'json',
            success : function (data){
                if (callback)
                {
                    callback(data, null);
                }
            },
            error : function (XMLHttpRequest, errorText){
                if (callback)
                {
                    callback(null, {
                        XMLHttpRequest : XMLHttpRequest,
                        errorText : errorText,
                    });
                }
            }
        });
    },

    /**
     * load wechat jssdk config
     * @param Object options
     * - jsApiList Array
     * - onReady Function
     * - onError Function
     */
    loadWechatJSSDKConfig : function (options)
    {
        var jsApiList = options.jsApiList || [];
        var onReady = options.onReady || null;
        var onError = options.onError || null;

        var api    = this.getApi('load_wechat_jssdk_config');
        if (!api)
        {
            return;
        }

        var me = this;

        $.ajax({
            type: "get",
            url: me.apiBaseUrl + api.url,
            dataType: "json",
            data: {
                url: location.href
            },
            success: function (data) {
                wx.config({
                    debug: getDebugStatus(),
                    appId: data.data.appId,
                    timestamp: data.data.timestamp,
                    nonceStr: data.data.nonceStr,
                    signature: data.data.signature,
                    jsApiList: jsApiList
                });

                wx.ready(onReady);

                if (onError)
                {
                    wx.error(onError);
                }
            }
        });
    },    // end loadWechatJSSDKConfig function define

    /**
     * get API by name
     * @param String  name
     * @param mixed   defaultValue    default value
     * @returns mixed
     */
    getApi : function(name, defaultValue)
    {
        if (name in apiList)
        {
            return apiList[name];
        }

        return defaultValue || null;
    },

    /**
     * send a request to a Web API
     * @param String  apiName  API name
     * @param Object  options  option in $.ajax()
     */
    callApi : function(apiName, options)
    {
        var api = this.getApi(apiName);

        if (!api)
        {
            alertDebugLog('api name: ' + apiName + ' not find.');
            return false;
        }

        options ? null : options = {};

        options.dataType    = options.dataType || 'json';
        options.type        = api.type || api.method || options.type || 'get';
        options.error        = options.error || this.ajaxErrorHandle;

        $.ajax(api.url, options);
    },

    /**
     * ajax load content into #main_content_container, use in menu.
     * @param url   String
     */
    openPanel: function (url, params)
    {
        // check current page.
        if (this.current === url)
        {
            return;
        }
        // save new url and load.
        this.current = url;

        // save params
        if (params)
        {
            this.panelParams = params;
        }
        else {
            this.panelParams = {};
        }

        // clean old content
        $('#main_content_container').html('');

        // ajax load content, then append to container
        $.ajax({
            url : url,
            success : function(result){
                $('#main_content_container').html(result);
            }
        });
    },

    /**
     * ajax load content into #main_content_container, use in menu.
     * @param url   String
     */
    openPanelAsIframe: function (url, params)
    {
        var iframeUrl = createUrl(url, params);

        // check current page.
        if (this.current === iframeUrl)
        {
            return;
        }
        // save new url and load.
        this.current = iframeUrl;

        // save params
        if (params)
        {
            this.panelParams = params;
        }
        else {
            this.panelParams = {};
        }

        $('#main_content_container').html('<iframe src="' + iframeUrl + '" style="width:100%;border:none;"></iframe>');

        // get screen radio to set iframe height
        var screenRatio = screen.height / screen.width;
        var width = $('#main_content_container iframe').width();
        var height = Math.floor(width * screenRatio);
        $('#main_content_container iframe').css({
            height : height + 'px'
        });
    },

    /**
     * ajax load content into containner of config:subPageContainner.
     * @param  String  url
     * @param  Object  params  url params
     */
    loadSubPage: function (url, params)
    {
        var me = this;

        // check current page.
        if (this.subPageUrl === url)
        {
            return;
        }
        // save new url and load.
        this.subPageUrl = url;

        // save params
        if (params)
        {
            this.subPageParams = params;
        }
        else {
            this.subPageParams = {};
        }

        // clean old content
        $(this.subPageContainner).html('');

        // ajax load content, then append to container
        $.ajax({
            url : url,
            success : function(result){
                $(me.subPageContainner).html(result);
            }
        });
    },

    /**
     * ajax load content into containner of config:subPageContainner as iframe.
     * @param  String  url
     * @param  Object  params  url params
     */
    loadSubPageAsIframe: function (url, params)
    {
        var iframeUrl = createUrl(url, params);

        // check current page.
        if (this.subPageUrl === iframeUrl)
        {
            return;
        }
        // save new url and load.
        this.subPageUrl = iframeUrl;

        // save params
        if (params)
        {
            this.subPageParams = params;
        }
        else {
            this.subPageParams = {};
        }

        if ( $(this.subPageContainner).length && $(this.subPageContainner)[0].nodeName === 'iframe' )
        {
            $(this.subPageContainner)[0].src = iframeUrl;
        }
        else
        {
            $(this.subPageContainner).html('<iframe src="' + iframeUrl + '" style="width:100%;border:none;"></iframe>');
        }

        // get screen radio to set iframe height
        var screenRatio = screen.height / screen.width;
        var width = $(this.subPageContainner).find('iframe').width();
        var height = Math.floor(width * screenRatio);
        $(this.subPageContainner).find('iframe').css({
            height : height + 'px'
        });
    },

    logout : function()
    {
        var logoutApi = this.getApi('logout');
        $.ajax({
            url : logoutApi.url,
            complete : function(){
                location.href = 'login.html';
            }
        });
    },

    /**
     * @param   Object          options
     * @param   Function        callback
     * - Object|null    error
     * - Object|null    response data
     */
    requestApi : function (options, callback) {

        axios(options).then(res => {
            callback ? callback(null, res.data) : null;
        }).catch(error => {
            callback ? callback(error, null) : null;
        });

    },

    /**
     * @param   Object  wechatShareOptions
     */
    setWechatShare : function (wechatShareOptions)
    {
        if ( typeof(wx) === 'undefined' )
        {
            addConsoleLog('[error] wx object not defined.');
            return false;
        }

        if (typeof(wx.updateTimelineShareData) !== 'undefined')
        {
            wechatShareOptions = mergeObject(wechatShareOptions, {
                success: function (){
                    log('set wechat share success.');
                },
                fail : function (){
                    log('set wechat share failed.');
                }
            });
            wx.updateTimelineShareData(wechatShareOptions);
            wx.updateAppMessageShareData(wechatShareOptions);
        }
        else
        {
            wechatShareOptions = mergeObject(wechatShareOptions, {
                success: function (){
                    log('wechat share success callback.');
                },
                fail : function (){
                    log('wechat share fail callback.');
                },
                cancel : function (){
                    log('wechat share cancel callback');
                }
            });
            wx.onMenuShareTimeline(wechatShareOptions);
            wx.onMenuShareAppMessage(wechatShareOptions);
            wx.onMenuShareQQ(wechatShareOptions);
            wx.onMenuShareQZone(wechatShareOptions);
            wx.onMenuShareWeibo(wechatShareOptions);
        }

        return true;
    },

    /**
     * @param   String  type  type name in sound property
     * @return  Boolean
     */
    playSound : function (type){
        if (typeof (this.config.sound[type]) === 'undefined')
        {
            addConsoleLog('[error] not found sound file with type: ' + type);
            return false;
        }
        var file = this.baseUrl + this.config.sound[type];
        if (!this.soundPlayer.paused)
        {
            this.soundPlayer.pause();
        }
        this.soundPlayer.src = file;

        log('play sound, type: ' + type + '.');
        try {
            this.soundPlayer.play();
        }
        catch (e)
        {
            log('play sound failed.');
            addConsoleLog(e);
            return false;
        }

        log('play sound success.');
        return true;
    },

    /**
     * check promotion code in url, and save to storage and cookie.
     * call it twice before check login and after check login.
     * @requires    common_function, jquery.cookie
     */
    checkPromotion : function ()
    {
        // the promotionCode maybe is myself or others.
        var promotionCode = getUrlParam('promotionCode') || '';
        if (promotionCode)
        {
            log('url have promotionCode: ' + promotionCode);
            // save to session storage or cookie.
            if (!setSessionData('promotionCode', promotionCode))
            {
                $.cookie('promotionCode', promotionCode, {
                    path: '/'
                });
            }
        }

        if (this.user)
        {
            // get promotionCode from session storage or cookie
            log('logined, check promotionCode:');
            var promotionCode = getSessionData('promotionCode') || $.cookie('promotionCode');
            log('promotionCode= ' + promotionCode);

            if (promotionCode && this.user.introduceCode != promotionCode)
            {
                log('promotionCode is not mine, save promotion_from=' + promotion_from + '.');
                // not my promotionCode means it is other's promotionCode
                setCacheData('promotion_from', promotionCode);
            }

            // remove old promotionCode
            log('remove old promotionCode');
            if ( !removeSessionData('promotionCode') )
            {
                $.removeCookie('promotionCode');
            }
        }
    }

};

/**
 * short name for application
 * @type Object
 * @alias application
 */
var app = application;

