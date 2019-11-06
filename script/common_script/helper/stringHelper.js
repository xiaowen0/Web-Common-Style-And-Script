/**
 * helper to handle some string.
 */
export default {
    /**
     * repeat string
     * @param String  string
     * @param Number  times
     */
    repeat : function(string, times)
    {
        var result = "";

        for (var i=1; i<=times; i++)
        {
            result += string;
        }

        return result;
    },

    /**
     * replace string
     * @param string  String  The string being searched and replaced on.
     * @param find    String  The value being searched for.
     * @param replace String  The replacement value that replaces found search values.
     * @returns String
     */
    replace : function(string, find, replace)
    {
        if (find == replace) {
            return string;
        }

        var oStr = new String(string);
        while (oStr.indexOf(find) >= 0) {
            oStr = oStr.replace(find, replace);
        }
        return oStr;
    },

    /**
     * replace some data with key
     * @param string String
     * @param data Object  key-value pairs
     * @returns String
     */
    replaceData : function(string, data)
    {
        for (var p in data) {
            while (string.indexOf(p) >= 0) {
                string = string.replace(p, data[p]);
            }
        }

        return string;
    }
}

