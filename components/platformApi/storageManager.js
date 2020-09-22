import Cookies from 'js-cookie';

var manager = {

    name : 'storageManager',

    /**
     * @param   String  key
     * @param   String  value
     */
    setItem : function (key, value) {},

    /**
     * @param   String  key
     * @return  String|null
     */
    getItem : function (key) {},

    /**
     * @param   String  key
     */
    removeItem : function (key) {},

    clear : function () {}

};

if (typeof(navigator) !== 'undefined')  // browser platform
{
    manager.setItem = function (key, value) {

        if (typeof (localStorage) !== 'undefined')  // most browser support
        {
            localStorage.setItem(key, value);
            return;
        }

        Cookies.set(key, value);
    };

    manager.getItem = function (key) {

        var value = null;

        if (typeof (localStorage) !== 'undefined')  // most browser support
        {
            value = localStorage.getItem(key);
        }
        if (!value)
        {
            value = sessionStorage.getItem(key);
        }

        if (!value)
        {
            value = Cookies.get(key);
        }
        return value;
    };

    manager.removeItem = function (key) {

        if (typeof (localStorage) !== 'undefined')
        {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        }
        Cookies.remove(key);
    };

    manager.clear = function () {
        if (typeof (localStorage) !== 'undefined')
        {
            localStorage.clear();
            sessionStorage.clear();
        }
    };
}

else if ( typeof (wx) !== 'undefined' &&
    typeof(wx.getStorageSync) == 'function' )    // wechat mini program platform
{
    manager.setItem = function (key, value) {
        wx.setStorageSync(key, value);
    };

    manager.getItem = function (key) {
        return wx.getStorageSync(key);
    };

    manager.removeItem = function (key) {
        wx.removeStorageSync(key);
    };

    manager.clear = function () {
        wx.clearStorageSync();
    };
}

export default manager;
