export default {

    /**
     * @param   String  title   biz type's title
     * @returns String          biz type's key
     * @author  zhiwen
     */
    getKeyByTitle : function (title) {

        for (var key in this)
        {
            if (typeof(this[key]) != 'object')
            {
                continue;
            }

            if (this[key].title == title)
            {
                return key;
            }
        }

        return '';
    },

    /**
     * @param   String  title   biz type's title
     * @returns String|Number   biz type's code
     * @author  zhiwen
     */
    getCodeByTitle : function (title) {

        for (var key in this)
        {
            if (typeof(this[key]) != 'object')
            {
                continue;
            }

            if (this[key].title == title)
            {
                return this[key].code;
            }
        }

        return '';
    },

    /**
     * @param   String  code    enum code
     * @return  String
     * @author  zhiwen
     */
    getTitleByCode : function (code) {

        for (var key in this)
        {
            if (typeof(this[key]) != 'object')
            {
                continue;
            }

            if (this[key].code == code)
            {
                return this[key].title;
            }
        }

        return '';
    },

    /**
     * @return  Array
     */
    getList : function () {

        var list = [];
        for (var key in this)
        {
            if (typeof(this[key]) != 'object')
            {
                continue;
            }
            list.push({
                code : this[key].code,
                title : this[key].title
            });
        }
        return list;
    }
}
