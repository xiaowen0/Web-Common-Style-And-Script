/*
 *
 */
var helper = {

    isAndroid : false,
    isIphone : false,
    isIpad : false,

    os : '',

    deviceType : '',

    init : function () {

        //取得浏览器的userAgent字符串
        var userAgent   = navigator.userAgent;
        this.isAndroid  = userAgent.indexOf("Android") > -1;
        this.isIphone   = userAgent.indexOf("iPhone") > -1;
        this.isIpad     = userAgent.indexOf("iPad") > -1;

        if (this.isAndroid || this.isIphone || this.isIpad)
        {
            this.deviceType = 'mobile';
        }
        else
        {
            this.deviceType = 'pc';
        }

        var isWindows = userAgent.indexOf("Windows") > -1;
        var isLinux = userAgent.indexOf("Linux") > -1;
        var isMacintosh = userAgent.indexOf("Macintosh") > -1;
        if (isWindows)
        {
            this.os = 'Windows';
        }
        if (isLinux)
        {
            this.os = 'Linux';
        }
        if (isMacintosh)
        {
            this.os = 'Macintosh';
        }
        if (this.isAndroid)
        {
            this.os = 'Android';
        }
        if (this.isIphone || this.isIpad)
        {
            this.os = 'iOS';
        }
    }
};
helper.init();
export default helper;
