

var helper = {

    /**
     * encode html
     * @param String  str
     * @returns String
     */
    encode : function (str)
    {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br/>");
        return s;
    },

    /**
     * decode html
     * @param String  str
     * @returns String
     */
    decode : function (str)
    {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br\/>/g, "\n");
        return s;
    },

    nlToBr : function (str) {
        if (!str)
        {
            return str;
        }
        var reg = new RegExp("\n", "g");
        str = str.replace(reg, "<br/>");
        return str;
    },

    brToNl : function (str) {
        if (!str)
        {
            return str;
        }
        var reg = new RegExp("<br/>", "g");
        str = str.replace(reg, "\n");
        return str;
    },

    /**
     * remove all html tag in html code
     * @param   String  html  HTML code
     * @returns String
     */
    removeTag : function (html)
    {
        if (!html)
        {
            return html;
        }
        return html.replace(/<[^<>]+?>/g, '');//删除所有HTML标签
    },

    /**
     * filter img tag from html code
     * @param   String  html code
     * @return  Array
     */
    filterImg : function (html)
    {
        if (!html)
        {
            return html;
        }
        return new RegExp("<img[^>]*>").exec(html);
    },

    /**
     * filter image url list from html code
     * @param   String  html code
     * @return  Array
     */
    filterImageUrlList : function (html)
    {
        if (!html)
        {
            return [];
        }
        var tempEle = $(html);
        var imageList = tempEle.find('img');
        var urlList = [];

        for (var i=0; i<imageList.length; i++)
        {
            urlList.push(imageList.eq(i).attr('src'));
        }

        return urlList;
    },

    /**
     * get body html from html code
     * @param  String  html
     * @return String|false
     */
    getBodyHtml : function (html)
    {
        try {
            var splitResult = html.split(/\<body[^\>]*\>/);
            if (splitResult.length < 2) {
                log('can not found string: /\<body[^\>]*\>/');
                return false;
            }
            html = splitResult[1].replace('</body>', '');
        }
        catch (e) {
            log(e);
            return false;
        }

        return html;
    }

};

export default helper;
