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
     * go to top of window
     * if has jQuery, then use animate method for transition effect.
     */
    scrollTo : function(top)
    {
        top ? null : top = 0;

        var scrollHeight = this.getScrollHeight();
        if (top > scrollHeight)
        {
            top = scrollHeight;
        }

        document.body.scrollTop = top;    // For Safari
        document.documentElement.scrollTop = top; // For Chrome, Firefox, IE and Opera
        return;

        // var distance = scrollTop - top;
        //
        // var timeLength = 100;
        // if (distance < 100)
        // {
        //     timeLength = 1000;
        // }
        // else if (distance >= 1000)
        // {
        //     timeLength = 200;
        // }
        //
        // var stepNum = 100;
        // // example 1000px / 10second = 100px / 1s
        // var speed = distance / timeLength;
        //
        // var stepFinished = 0;
        // var step = (function (){
        //
        //     // 1000 - (1000 / 100 = 10px), 100px/step 10step
        //     var stepTop = top + distance - Math.floor(distance * ((stepFinished + 1) / stepNum));
        //     console.log('step length: ' + distance * ((stepFinished + 1) / stepNum));
        //     console.log('stepTop: ' + stepTop);
        //
        //     document.body.scrollTop = stepTop;    // For Safari
        //     document.documentElement.scrollTop = stepTop; // For Chrome, Firefox, IE and Opera
        //
        //     stepFinished++;
        //
        //     // go on next step
        //     if (stepFinished < stepNum)
        //     {
        //         window.setTimeout(function (){
        //             step();
        //         }, timeLength / speed);   // 总长度除以速度等于每步时长
        //     }
        //
        // });
        // step();

    }
};

