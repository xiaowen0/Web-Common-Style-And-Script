/*
 *
 */
var helper = {

    isAndroid : false,
    isIphone : false,
    isIpad : false,

    deviceName : '',

    init : function () {

        //取得浏览器的userAgent字符串
        var userAgent  = navigator.userAgent;
        this.isAndroid     = userAgent.indexOf("Android") > -1;
        this.isIphone  = userAgent.indexOf("iPhone") > -1;
        this.isIpad  = userAgent.indexOf("iPad") > -1;
    }
};
helper.init();
export default helper;
