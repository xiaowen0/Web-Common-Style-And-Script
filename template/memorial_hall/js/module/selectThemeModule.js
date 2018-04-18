/**
 * Created by wen on 2018/4/9.
 */

define(['vue', 'jquery'], function (Vue)
{
    var selectThemeContainer = new Vue({
        el: '#selectThemeContainer',
        data: {},
        methods: {
            selectTheme: function (name)
            {
                if ($('#themeStyleSheet').length)
                {
                    $('#themeStyleSheet').remove();
                }

                var themeStyleSheetUrl = 'theme/' + name + '.css';
                var themeStyleSheetLink = $('<link rel="stylesheet" id="themeStyleSheet"/>')
                    .attr('href', themeStyleSheetUrl).appendTo(document.head);
            }
        }
    });
});

