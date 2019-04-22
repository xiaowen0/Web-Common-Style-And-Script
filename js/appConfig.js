/**
 * web application client config
 * recommend use app.js
 */

var appConfig = {

    /**
     * ajax error handle
     */
    ajaxErrorHandle : (function(XMLHttpRequest, errorText)
    {
        var status      = XMLHttpRequest.status;
        var statusText  = XMLHttpRequest.statusText;
        var responseText = XMLHttpRequest.responseText;

        var errorMessage = '';

        if (getDebugStatus())
        {
            errorMessage = 'Status code: ' + status + ' ' + statusText;
            showMessageBox(errorMessage, '出错了');
            if ( $('#debugInfoDialog').length )
            {
                var info = '<p>' + errorMessage + '</p>';
                $('#debugInfoDialog .infoContainer').append(info);
                var info = '<p>' + responseText + '</p>';
                $('#debugInfoDialog .infoContainer').append(info);
            }
        }
        else
        {
            if (status >= 500 && status < 600)
            {
                errorMessage = errorMessageList.InternalServerError;
            }
            else if (status === 408)     // 408 Request Timeout
            {
                errorMessage = errorMessageList.RequestTimeout;
            }
            else if (status === 409)     // 409 Conflict
            {
                errorMessage = errorMessageList.RequestConflict;
            }
            else
            {
                errorMessage = errorMessageList.defaultText;
            }

            showMessageBox(errorMessage, '失败');
        }

    }),

    fancyboxOptions : {
        iframe : {
            css : {
                width : '90%',
                height : '90%'
            }
        }
    },

    lightboxOption : {
        alwaysShowNavOnTouchDevices : true,
        albumLabel : "%1/%2"
    }

};

var application = {};
var app = application;
