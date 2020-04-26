/**
 * helper to operate file
 */
export default {

    imageTypeList : ["jpg","jpeg","png","gif","svg"],
    videoTypeList : ["webm","mp4"],

    /**
     * add url param  添加网址参数
     * @param url String  网址
     * @param name String  param name  参数名
     * @param value String  param alue  参数的值
     */
    addUrlParam : function(url, name, value)
    {
        var new_url = url;
        if (url.indexOf("?") < 0) {
            new_url += "?";
        }
        else {
            new_url += "&";
        }
        new_url += name + "=" + value;
        return new_url;
    },

    /**
     * get url param  获取网址参数
     * @param name String  param name  参数名
     * @returns fixed  param value  参数的值
     */
    getUrlParam : function(name)
    {

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
    paramsToQueryString : function (params) {

        var queryList = [];
        for (var key in params)
        {
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
    createUrl : function(url, params)
    {
        if (typeof(params) !== 'object')
        {
            return url;
        }

        var param_string = '';

        for (var name in params) {
            param_string.length ? param_string += '&' : null;

            param_string += name + '=' + params[name];
        }

        if (url.indexOf('?') >= 0)
        {
            url += '&';
        }
        else {
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
    isCSS : function(url)
    {
        return url.substr(-4) == '.css';
    },
    isStyleSheet : function (url)
    {
        return this.isCSS(url);
    },

    /**
     * check if a url is script file
     * @param  String  url
     * @return Boolean
     */
    isScript : function(url)
    {
        return this.isJs(url);
    },
    isJs : function(url)
    {
        return url.substr(-3) == '.js';
    },

    /**
     * check if a url is image format
     * @param   String  url
     * @return  boolean
     */
    isImage : function(url)
    {
        var formatList = this.imageTypeList;
        for (var i=0; i<formatList.length; i++)
        {
            if (name.substr(0-formatList[i].length) === formatList[i])
            {
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
    isVideo : function(url)
    {
        var formatList = this.videoTypeList;
        for (var i=0; i<formatList.length; i++)
        {
            if (name.substr(0-formatList[i].length) === formatList[i])
            {
                return true;
            }
        }

        return false;
    }
}
