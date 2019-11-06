/**
 * helper to operate file
 */
export default {

    imageTypeList : ["jpg","jpeg","png","gif","svg"],
    videoTypeList : ["webm","mp4"],

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
