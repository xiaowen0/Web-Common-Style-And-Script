import animationHelper from './animationHelper';

/**
 * helper to operate window
 */
export default {
    /**
     * get window height  获取窗口的高度
     * @returns Number
     */
    getHeight : function()
    {
        // standard API: window.innerHeight
        var height = window.innerHeight
            || window.height;               // IE old version

        return height ? height : 0;
    },

    /**
     * get window width  获取窗口的宽度
     * @returns Number
     */
    getWidth : function()
    {
        // standard API: window.innerWidth
        var width = window.innerWidth
            || window.width;            // IE old version

        return width ? width : 0;
    },

    /**
     * Get scroll top  获取窗口视图区域到顶部的滚动距离
     * @returns Number|false
     */
    getScrollTop : function()
    {
        if (document.documentElement && document.documentElement.scrollTop)     // For standard
        {
            return document.documentElement.scrollTop;
        }
        else if (document.body)     // For Internet Explorer old version
        {
            return document.body.scrollTop;
        }
        return false;
    },

    /**
     * Get scroll height  获取窗口视图区域的高度
     * @returns Number
     */
    getScrollHeight : function()
    {
        if (document.documentElement && document.documentElement.scrollHeight)      // For standard
        {
            return document.documentElement.scrollHeight;
        }
        else if (document.body)     // For Internet Explorer
        {
            return document.body.scrollHeight;
        }
        return false;
    },

    /**
     * @param   Number  top
     * @author  zhiwen
     */
    scrollTo : function(top = 0)
    {
        var scrollHeight = this.getScrollHeight();
        if (top > scrollHeight)
        {
            top = scrollHeight;
        }

        var current = this.getScrollTop();

        animationHelper.animate({
            easing : 'easeOutExpo',
            from : current,
            to : top,
            step : function (value) {
                document.body.scrollTop = value;    // For Safari
                document.documentElement.scrollTop = value; // For Chrome, Firefox, IE and Opera
            }
        });

    }
};

