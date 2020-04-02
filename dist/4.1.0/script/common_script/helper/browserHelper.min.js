import consoleHelper from './consoleHelper';

/*
 * 各种浏览器的 userAgent 参考
 *
 * Edge: 使用 Chrome 核心，包含 AppleWebKit 和 Chrome
 * Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063
 *
 * IE userAgent: 使用 Trident 核心，包含 Trident
 * Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.3; rv:11.0) like Gecko
 * Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)
 * Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)
 * Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; WOW64; Trident/4.0; SLCC1)
 * Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; WOW64; Trident/4.0; SLCC1)
 * Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; WOW64; Trident/4.0; SLCC1)
 *
 * Firefox userAgent: 使用 Gecko 核心，包含 Gecko
 * Mozilla/5.0 (Windows; U; Windows NT 5.2) Gecko/2008070208 Firefox/3.0.1
 * Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070309 Firefox/2.0.0.3
 * Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070803 Firefox/1.5.0.12
 * Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0
 *
 * Opera userAgent: 早期版本使用 Presto 核心，包含 Presto 或 Opera，新版本使用 Chrome 核心，包含 Chrome 和 AppleWebKit
 * Opera/9.27 (Windows NT 5.2; U; zh-cn)
 * Opera/8.0 (Macintosh; PPC Mac OS X; U; en)
 * Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36 OPR/37.0.2178.31
 * Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36 OPR/37.0.2178.31
 *
 * Safari userAgent: 使用 AppleWebKit 核心，包含 AppleWebKit
 * Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13
 * Mozilla/5.0 (iPhone; U; CPU like Mac OS X) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/4A93 Safari/419.3
 * Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A
 *
 * Google Chrome userAgent: 使用 Chrome 核心，包含 AppleWebKit 和 Chrome
 * Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Chrome/0.2.149.27 Safari/525.13
 * Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36
 * Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36
 * Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
 *
 * Navigator 使用 Gecko 核心，包含 Gecko
 * Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.12) Gecko/20080219 Firefox/2.0.0.12 Navigator/9.0.0.6
 */

var helper = {

    isOpera : false,
    isEdge : false,
    isFirefox : false,
    isSafari : false,
    isChrome : false,
    isIE : false,
    isWechat : false,
    isWindowsWechat : false,

    browserName : '',

    init : function () {

        //取得浏览器的userAgent字符串
        var userAgent  = navigator.userAgent;
        this.isOpera    = userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR");
        this.isEdge     = userAgent.indexOf("Edge") > -1;
        this.isFirefox  = userAgent.indexOf("Firefox") > -1;
        this.isSafari   = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1;
        this.isChrome   = userAgent.indexOf("Chrome") > -1 && !this.isEdge && !this.isOpera;
        this.isIE       = userAgent.indexOf("MSIE") || userAgent.indexOf("Trident");
        this.isWechat   = userAgent.indexOf('MicroMessenger') >= 0;
        this.isWindowsWechat    = userAgent.toLocaleLowerCase().indexOf('windowswechat') >= 0;

        if (this.isWindowsWechat)
        {
            this.browserName = 'PC Wechat';
        }
        else if (this.isWechat)
        {
            this.browserName = 'Wechat';
        }
        else if (this.isIE)
        {
            this.browserName = 'Internet Explorer';
        }
        else if (this.isEdge)
        {
            this.browserName = 'Edge';
        }
        else if (this.isFirefox)
        {
            this.browserName = 'Firefox';
        }
        else if (this.isOpera)
        {
            this.browserName = 'Opera';
        }
        else if (this.isChrome)
        {
            this.browserName = 'Google Chrome';
        }
        else if (this.isSafari)
        {
            this.browserName = 'Safari';
        }
        else {
            this.browserName = 'Unknown';
        }
    },

    /**
     * Get browser core  获取浏览器核心
     * @returns String  core name
     */
    getCore : function()
    {
        // Find known core names from the userAgent data  搜索核心名称
        var userAgent = window.navigator.userAgent;
        var isGecko = RegExp("Gecko").test(userAgent);
        var isWebkit = RegExp("AppleWebKit").test(userAgent);
        var isPresto = RegExp("Presto").test(userAgent);
        var isTrident = RegExp("IE").test(userAgent);

        // Return result  返回结果
        if (isWebkit) {
            return "Webkit";
        }
        else if (isGecko) {
            return "Gecko";
        }
        else if (isPresto) {
            return "Presto";
        }
        else if (isTrident) {   // last check, Trident core userAgent include Gecko string
            return "Trident";
        }

        // Return "unknown" as unknown core  不是主流浏览器
        return "unknown";
    },

    /**
     * Get IE browser core  获取 IE 的版本
     * @returns Number
     */
    getIeVersion : function()
    {
        // Check whether the current browser is IE  检查是否 IE 浏览器
        var userAgent = window.navigator.userAgent;
        var isIE = userAgent.search(RegExp("MSIE [0-9.]+;"));
        if (!isIE) {
            return 0;
        }

        // Get the browser version  获取版本
        var version = userAgent.match(RegExp("MSIE [0-9]+.[0-9]+;"))[0];
        version = version.replace(RegExp("MSIE ([0-9])+.[0-9]+;"), "$1");
        return Number(version);
    },

    /**
     * get browser language, return lower case text like "zh-cn".
     * @return String
     */
    getBrowserLanguage : function()
    {
        // web standard use navigator.language API, value is no case
        // and IE6-8 use navigator.browserLanguage API, value is lower case.
        var lang = '';
        try {
            lang = (navigator.language || navigator.browserLanguage).toLowerCase();
        }
        catch (e) {
            consoleHelper.logError(e);
            return lang;
        }

        return lang;
    },

    /**
     * check browser
     * @return Object
     * - cssVersion  String  CSS version
     * - storageSupported  Boolean
     * - jsonSupported  Boolean
     * - fileReaderSupported  Boolean
     * - evaluate  String  good|normal|bad
     */
    checkBrowserFunction : function()
    {
        var result = {
            cssVersion : '0',
            storageSupported : typeof (localStorage) != 'undefined',
            jsonSupported : typeof (JSON) != 'undefined',
            fileReaderSupported : typeof (FileReader) != 'undefined',
            evaluate : ''
        };

        if ( typeof(document.body.style) == 'undefined')
        {
            result.cssVersion = '0';
        }
        else if ( typeof(document.body.style.display) == 'undefined')
        {
            result.cssVersion = '1';
        }
        else if ( typeof(document.body.style.borderRadius) != 'undefined')
        {
            result.cssVersion = '3';
        }
        else if ( typeof(document.body.style.fontSize) != 'undefined')
        {
            //
            result.cssVersion = '2.1';
        }
        else if ( typeof(document.body.style.backgroundImage) != 'undefined')
        {
            result.cssVersion = '2';
        }

        var score = 0;

        result.storageSupported ? score++ : null;
        result.jsonSupported ? score++ : null;
        result.fileReaderSupported ? score++ : null;

        if (score>=3)
        {
            result.evaluate = 'good';
        }
        else if (result.cssVersion >= '3')
        {
            result.evaluate = 'normal';
        }
        else
        {
            result.evaluate = 'bad';
        }

        return result;
    }
};
helper.init();
export default helper;
