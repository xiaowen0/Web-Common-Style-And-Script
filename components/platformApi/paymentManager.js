import deviceHelper from '@util/deviceHelper';

var manager = {

    name : 'paymentManager',

    /**
     * get payment way
     * @return  String  SCAN|ANDROID|IOS|H5  default: H5
     */
    getPaymentWay : function (){ return ''; },

};

if (typeof(navigator) !== 'undefined')  // browser platform
{
    /**
     * @override
     * PC       -> scan qr code to pay
     * ANDROID  -> call Android API
     * IOS      -> call iOS API
     * H5       -> call wechat payment API
     */
    manager.getPaymentWay = (function ()
    {
        if (deviceHelper.deviceType === 'pc'){  // scan payment Qr code
            return 'SCAN';
        }

        if (deviceHelper.isAndroidApp)     // call Android payment or other payment app
        {
            return 'ANDROID';
        }
        else if (deviceHelper.isIphoneApp)  // call Apple payment or other payment app
        {
            return 'IOS';
        }

        return 'H5'     // call wechat webpage payment or other web payment platform.
    });
}

else if ( typeof(setInterval) == 'function' )    // wechat mini program platform
{
    manager.getPaymentWay = (function ()
    {
        return 'H5';
    });
}

export default manager;
