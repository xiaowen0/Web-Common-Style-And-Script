/**
 * app config
 * @type Object
 */
var appConfig = {

	loadWechatJSSDKConfigUrl : '',

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
			app.showMessageBox(errorMessage, '出错了');
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

			app.showMessageBox(errorMessage, '失败');
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

/**
 * web client application object
 * @type Object
 * @requires jQuery
 */
var application = {

	/**
	 * app config
	 * @type  Object
	 */
	config : appConfig,
	/**
	 * show message use messagebox
	 * @param  String  content
	 * @param  String  title
	 */
	showMessageBox : function (content, title){
		if (typeof(dialog) !== 'undefined')
		{
			dialog.msg(content);
		}
		else
		{
			alert(content);
		}
	},
	
	/**
	 * load wechat jssdk config
	 * @param Object options
	 * - jsApiList Array
	 * - onRead Function
	 * - onError Function
	 */
	loadWechatJSSDKConfig : function (options)
	{
		var jsApiList = options.jsApiList || [];
		var onReady = options.onReady || null;
		var onError = options.onError || null;
		
		var me = this;
		
		$.ajax({
		    type: "get",
		    url: Link.prefix.realmName + "base/wx/jssdkconfig/jssdk",
		    dataType: "json",
		    data: {
		        url: location.href
		    },
		    success: function (data) {
		        wx.config({
		            debug: false,
		            appId: data.data.appId,
		            timestamp: data.data.timestamp,
		            nonceStr: data.data.nonceStr,
		            signature: data.data.signature,
		            jsApiList: jsApiList
		        });
				
		        wx.ready(onReady);
				
				if (onError)
				{
					wx.error(onError);
				}
		    }
		});
	}
};

/**
 * short name for application
 * @type Object
 * @alias application
 */
var app = application;
