/**
 * app config
 * only setting some params and methods.
 * @type    Object
 */
var appConfig = {

    title : '师讯管理平台',

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
        apiBaseUrl : '/'
    }, {
        id : 'beta',
        domain : 'test.xx.com',
        apiBaseUrl : 'test.xx.com/api/'
    }, {
        id : 'dist',
        domain : 'www.xx.com',
        apiBaseUrl : 'api.xx.com/api/'
    }],

    /**
     * api base url, prefix of api url.
     */
    apiBaseUrl : '/',

    /**
     * sub page containner selector expression
     */
    subPageContainner : '#main_content_container',

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
if (typeof(apiList) != 'undefined')
{
    appConfig.apiList = apiList;
}

/**
 * web client application object
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
     * environment sign
     * @type    String
     */
    env : 'dev',

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
     * app config
     * @type  Object
     */
    config : {},

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

    init : function (config)
    {
        if (this.status == 'ready')
        {
            return true;
        }

        this.title = appConfig.title || '';
        this.config = appConfig || {};
        this.apiList = this.config.apiList || {};

        this.checkEnvironment(this.config.envList || []);
        this.initResources(this.config.resourceList || []);

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
                this.apiBaseUrl = envList[i].apiBaseUrl;
                return;
            }
        }
    },

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
     * show message use messagebox
     * @param  String  content
     * @param  String  title
     */
    showMessageBox : function (content, title){
        if (typeof(dialog) !== 'undefined')
        {
            dialog.msg(content);
        }
        else
        {
            alert(content);
        }
    },

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
    }

};

/**
 * short name for application
 * @type Object
 * @alias application
 */
var app = application;

