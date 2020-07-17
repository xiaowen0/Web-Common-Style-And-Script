/**
 * helper to operate file
 */
export default {

    imageTypeList: ["jpg", "jpeg", "png", "gif", "svg"],
    videoTypeList: ["webm", "mp4"],

    /**
     * @param   String  url
     * @return  Object
     * - String origin
     * - String urlNoParam
     * - String protocol
     * - String hostname
     * - String port
     * - String path
     * - Object params
     * - String hash
     */
    getParts : function (url) {

        var urlParts = {
            origin : url,
            urlNoParam : '',
            protocol : '',
            hostname : '',
            port : '',
            path : '',
            params : {},
            hash : ''
        };

        // get hash
        var tParts = url.split('#');
        url = tParts[0];
        tParts.shift();

        if (tParts.length)
        {
            urlParts.hash = tParts.join('');
        }

        // get url params
        tParts = url.split('?');
        url = urlParts.urlNoParam = tParts[0];
        tParts.shift();

        if (tParts.length)
        {
            var paramsStr = tParts.join('');
            var paramsParts = paramsStr.split('&');
            for (var i=0; i<paramsParts.length; i++)
            {
                var paramItemParts = paramsParts[i].split('=');
                var tParamName = paramItemParts[0];
                if (tParamName === '')
                {
                    continue;
                }
                paramItemParts.shift();

                var tParamValue = '';
                if (paramItemParts.length)
                {
                    tParamValue = paramItemParts.join('');
                }

                urlParts.params[tParamName] = tParamValue;
            }
        }

        // get protocol
        tParts = url.split('://');
        if (tParts.length >= 2)
        {
            urlParts.protocol = tParts[0];
            tParts.shift();
        }
        url = tParts.join('');
        if (url.substr(0, 2) === '//')   // remove "//"
        {
            url = url.substr(2);
        }
        // console.log('url after get protocol: ' + url);

        // get hostname
        tParts = url.split('/');
        urlParts.hostname = tParts[0];
        tParts.shift();
        if (tParts.length)
        {
            url = tParts.join('/');
        }
        else
        {
            url = '';
        }
        // console.log('url after get hostname: ' + url);
        urlParts.path = url;

        return urlParts;
    },

    /**
     * add url param  添加网址参数
     * @param url String  网址
     * @param name String  param name  参数名
     * @param value String  param alue  参数的值
     */
    updateUrlParam: function (url, name, value) {
        var reg = /#/g;
        if (url) {
            url = url.replace(reg, "?" + name + "=" + value + "#");
        }
        return url
    },

    /**
     * add url param  添加网址参数
     * @param url String  网址
     * @param name String  param name  参数名
     * @param value String  param alue  参数的值
     */
    addUrlParam: function (url, name, value) {

        var urlParts = url.split('#');
        var new_url = urlParts[0];
        var hash = urlParts.length >= 2 ? urlParts[1] : '';

        // var new_url = url;
        if (url.indexOf("?") < 0) {
            new_url += "?";
        } else {
            new_url += "&";
        }
        new_url += name + "=" + value;
        hash ? new_url += '#' + hash : null;
        return new_url;
    },

    /**
     * get url param  获取网址参数
     * @param name String  param name  参数名
     * @returns fixed  param value  参数的值
     */
    getUrlParam: function (name) {

        var default_value = arguments[1] ? arguments[1] : null;

        // get query string
        var query_string = location.search.replace('?', '');

        // no any param
        if (!query_string.length) {
            return default_value;
        }

        // 以 & 分割字符串(a=1&b=2) to ['a=1', 'b=2']
        var url_query_params = query_string.split("&");

        var index_name = -1;
        for (var i = 0; i < url_query_params.length; i++) {

            index_name = url_query_params[i].indexOf(name + "=");

            // 参数名开头
            if (index_name === 0) {
                return url_query_params[i].substring(index_name + 1 + name.length);
            }
        }

        return default_value;
    },

    /**
     * query params (type object) convert to query string (example: a=1&b=2)
     * @param   Object  params
     * @return  String
     */
    paramsToQueryString: function (params) {

        var queryList = [];
        for (var key in params) {
            queryList.push(key + '=' + params[key]);
        }

        var queryStr = queryList.join('&');
        return queryStr;
    },

    /**
     * create url with params
     * @param String url
     * @param Object params
     * @return String
     */
    createUrl: function (url, params) {
        if (typeof (params) !== 'object') {
            return url;
        }

        var param_string = '';

        for (var name in params) {
            param_string.length ? param_string += '&' : null;

            param_string += name + '=' + params[name];
        }

        if (url.indexOf('?') >= 0) {
            url += '&';
        } else {
            url += '?';
        }
        url += param_string;

        return url;
    },

    /**
     * check if a url is CSS file
     * @param  String  url
     * @return Boolean
     */
    isCSS: function (url) {
        return url.substr(-4) == '.css';
    },
    isStyleSheet: function (url) {
        return this.isCSS(url);
    },

    /**
     * check if a url is script file
     * @param  String  url
     * @return Boolean
     */
    isScript: function (url) {
        return this.isJs(url);
    },
    isJs: function (url) {
        return url.substr(-3) == '.js';
    },

    /**
     * check if a url is image format
     * @param   String  url
     * @return  boolean
     */
    isImage: function (url) {
        var formatList = this.imageTypeList;
        for (var i = 0; i < formatList.length; i++) {
            if (url.substr(0 - formatList[i].length) === formatList[i]) {
                return true;
            }
        }

        return false;
    },

    /**
     * check if a file name is video format
     * @param   String  url
     * @return  boolean
     */
    isVideo: function (url) {
        var formatList = this.videoTypeList;
        for (var i = 0; i < formatList.length; i++) {
            if (url.substr(0 - formatList[i].length) === formatList[i]) {
                return true;
            }
        }
        return false;
    },

    test : function () {
        console.log(this.getParts('http://localhost/?a=1&b=2#/ppp'));
        console.log(this.getParts('https://localhost/?=1&b=#/ppp'));
        console.log(this.getParts('http://www.example.com/path/to/file'));
        console.log(this.getParts('//localhost/?=1&b=#/ppp'));
        console.log(this.getParts('//localhost/path/to/file?=1&b=#/ppp'));
        console.log(this.getParts('https://192.168.1.1/path/to/file?a=1&b=2#/ppp'));
    }
}
