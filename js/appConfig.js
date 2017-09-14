/**
 * web application client config
 * Created by wen on 2017/8/27.
 */

var appConfig = {

    /**
     * ajax error handle
     */
    ajaxErrorHandle : (function(XMLHttpRequest, errorText)
    {
        var status      = XMLHttpRequest.status;
        var statusText  = XMLHttpRequest.statusText;

        var errorMessage = '';
        if (getDebugStatus())
        {
            errorMessage = 'Status code: ' + status + ' ' + statusText;
            showMessageBox(errorMessage, '出错了');
        }
        else
        {
            if (status === 408)     // 408 Request Timeout
            {
                errorMessage = errorMessageList.RequestTimeout;
            }
            if (status === 409)     // 409 Conflict
            {
                errorMessage = errorMessageList.RequestConflict;
            }
            else
            {
                errorMessage = errorMessageList.defaultText;
            }
            showMessageBox(errorMessage, '失败');
        }

    })

};
