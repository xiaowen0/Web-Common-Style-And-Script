/**
 * Created by wen on 2018/4/9.
 */

var selectThemeContainer = new Vue({
    el: '#selectThemeContainer',
    data: {

    },
    methods : {
        selectTheme : function(name){
            if ( $('#themeStyleSheet').length )
            {
                $('#themeStyleSheet').remove();
            }

            var themeStyleSheetUrl = 'css/theme/' + name + '.css';
            var themeStyleSheetLink = $('<link rel="stylesheet" id="themeStyleSheet"/>')
                .attr('href', themeStyleSheetUrl).appendTo(document.head);
        }
    }
});

