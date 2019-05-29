/**
 * app config
 * @type Object
 * @require errorMessageList.js  common_function.js
 */
var appConfig = {

    resourceList : [
        '../asset/font-awesome-4.7.0/css/font-awesome.min.css'
    ],

    loadWechatJSSDKConfigUrl : '',

    /**
     * api base url, prefix of api url.
     */
    apiBaseUrl : '/admin/',

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

        if (getDebugStatus())
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

/**
 * web client application object
 * @type Object
 * @requires jQuery
 */
var application = {

    /**
     * url base path
     * @type  String
     */
    baseUrl : '',

    /**
     * app config
     * @type  Object
     */
    config : appConfig,

    /**
     * app config
     * @type  Array
     */
    resourceList : [],

    /**
     * sub page source url, if use div or iframe to load external page (html)
     */
    subPageUrl : '',

    /**
     * sub page params
     * @type Object
     */
    subPageParams : {},

    init : function ()
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
        var resources = this.config.resourceList;
        for (var i=0; i<resources.length; i++)
        {
            this.import(resources[i]);
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
     * - onRead Function
     * - onError Function
     */
    loadWechatJSSDKConfig : function (options)
    {
        var jsApiList = options.jsApiList || [];
        var onReady = options.onReady || null;
        var onError = options.onError || null;

        var me = this;

        $.ajax({
            type: "get",
            url: Link.prefix.realmName + "base/wx/jssdkconfig/jssdk",
            dataType: "json",
            data: {
                url: location.href
            },
            success: function (data) {
                wx.config({
                    debug: false,
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
    },	// end loadWechatJSSDKConfig function define

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

        $(this.subPageContainner).html('<iframe src="' + iframeUrl + '" style="width:100%;border:none;"></iframe>');

        // get screen radio to set iframe height
        var screenRatio = screen.height / screen.width;
        var width = $(this.subPageContainner).find('iframe').width();
        var height = Math.floor(width * screenRatio);
        $(this.subPageContainner).find('iframe').css({
            height : height + 'px'
        });
    }
};

/**
 * short name for application
 * @type Object
 * @alias application
 */
var app = application;

