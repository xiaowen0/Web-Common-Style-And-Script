/**
 * helper to operate DOM
 */
export default {

    /**
     * get element by id  根据ID获取元素
     * @param id String  element ID
     * @returns Object(HTMLElement) | null
     */
    getById : function (id)
    {
        return document.getElementById(id);
    },

    /**
     * get element by id  根据ID获取元素
     * @param id String  element ID
     * @returns Object(HTMLElement) | null
     */
    getElement : function(id)
    {
        return this.getById(id);
    },

    /**
     * get elements
     * @param selector  CSS query selector
     * @returns {*}
     */
    get : function(selector)
    {
        try {
            if (typeof(document.querySelector) != 'function') {
                addConsoleLog('querySelector is not supported in current client.');
                return false;
            }

            return document.querySelector(selector);
        }
        catch (e) {
            return false;
        }
    },

    /**
     * create element  创建元素
     * @param name     String  element name
     * @param options  Object  element attributes
     * @param content  Object of HTMLElement | String  element content
     * @returns Object(HTMLElement) | false
     */
    createElement : function(name, options, content)
    {
        // create element
        var element = document.createElement(name);

        // set attributes
        if (options !== null) {
            for (var attr_name in options) {
                element.setAttribute(attr_name, options[attr_name]);
            }
        }

        // set content
        if (typeof (content) === "object") {
            element.innerHTML = content.outerHTML;
        }
        else if (typeof (content) === 'string') {
            element.innerHTML = content;
        }

        // return
        return element;
    },

    /**
     * generate a unique id for a element, the result is like "element_n" (n is a natural number) format.
     * @param   String  name        element type name, default: "element"
     * @param   String  delimiter   default: "_"
     * @return  String
     */
    generateIdForElement : function(name, delimiter)
    {
        // param default value
        name        ? null : name = 'element';
        delimiter   ? null : delimiter = '_';

        var exist   = true;
        var number  = 1;
        var maxNumber   = 999;
        var id = '';

        while (exist && number <= maxNumber)
        {
            id = name + delimiter + number;
            exist = getElement(id) != null;

            number++;
        }

        return id;
    },

    /**
     * get target data-* value in a event handler
     * @param   Object  event
     * @param   String  name
     * @return  String
     */
    getTargetDataByEvent : function(event, name)
    {
        var target = event.currentTarget;
        if (typeof(target.dataset[name]) != 'undefined')
        {
            return target.dataset[name];
        }

        return '';
    },

    /**
     * print tag  输出一个 HTML 标记
     * @param name     String  element name
     * @param options  Object  element attributes
     * @param content  Object of HTMLElement | String  element content
     */
    printTag : function(name, options, content)
    {
        var element = createElement(name, options, content);
        document.writeln(element.outerHTML);
    },

    /**
     * print stylesheet link
     * @param url  String
     */
    printStylesheetLink : function(url)
    {
        document.writeln('<link rel="stylesheet" href="' + url + '"/>');
    },

    /**
     * load style sheet
     * @param url  String  url to style sheet file.
     * @return  String  absolute path for file url
     */
    loadStylesheet : function(url)
    {
        var stylesheetLink = createElement('link', {
            href : url,
            rel : "stylesheet"
        });
        document.head.appendChild(stylesheetLink);
        return stylesheetLink.href;
    },

    /**
     * load script
     * @param url  String  url to script file.
     * @param options  Object  options for this action
     * - onload  Function
     * @return  String  absolute path for file url
     */
    loadScript : function(url, options)
    {
        options = options || {};

        var scriptLink = this.createElement('script', {
            src : url
        });

        var onload = options.onload || (function(){});
        if (onload)
        {
            scriptLink.onload = onload;
        }

        document.body.appendChild(scriptLink);
        return scriptLink.src;
    },

    /**
     * load content from html,css,script
     * @param  Object  options
     * - id      String  (required) content id
     * - html    String  (required) html file url, example: 'modules/article.html'
     * - css     String  css file url, example: 'style/article.css'
     * - script  String  script file url, example: 'js/article.js'
     * - target  HTMLElement|String  default: body, element object or selector string
     * - cache   Boolean  default: false, use SessionStorage to cache content
     * - callback  Function  callback when content dom ready
     * @return Boolean
     */
    loadContent : function(options)
    {
        var id     = options.id || '';
        var html   = options.html || '';
        var css    = options.css || '';
        var script = options.script || '';
        var target = options.target || document.body;
        var cache  = options.cache || false;
        var callback  = options.callback || null;

        if (!id)
        {
            addConsoleLog('[error] missing id param for loadContent function.');
            return false;
        }

        if (!html)
        {
            addConsoleLog('[error] missing html param for loadContent function.');
            return false;
        }

        var htmlCode = '';

        // run when content dom is ready
        var init = (function (){

            if (script)
            {
                loadScript(script);
            }

            if (callback)
            {
                callback();
            }

        });

        var loadHtml = (function (htmlUrl){

            $.ajax({
                url : htmlUrl,
                success : function (result){

                    htmlCode = result;

                    // save cache
                    if (cache)
                    {
                        var cache_key = id + '_html';
                        setSessionData(cache_key, htmlCode);
                    }

                    // insert content and init
                    $(target).append(htmlCode);
                    init();
                },
                error : function (){
                    setTimeout(function (){
                        loadHtml(htmlUrl);
                    }, 5000);
                }
            });

        });

        // try to get content from cache
        if (cache)
        {
            var cache_key = id + '_html';
            htmlCode = getSessionData(cache_key) || '';
        }
        if (htmlCode)  // has cache data
        {
            // insert content and init
            $(target).append(htmlCode);
            init();
        }
        else  // no cache data
        {
            loadHtml(html);
        }

        // load css if need
        if (css)
        {
            loadStylesheet(css);
        }

        return true;
    },

    /**
     * set a element middle position in his parent
     * @param  String|Array  element CSS selector path or array
     * @returns boolean
     */
    setMiddlePosition : function(element)
    {
        // check param type
        if (typeof(element) === 'string')
        {
            var elementQuery = $(element);
            if (elementQuery.length)
            {
                element = elementQuery[0];
            }
            else
            {
                return false;
            }
        }

        // get parent
        var parent = element.parentNode;

        // set
        $(parent).css('overflow', 'hidden');
        $(element).css('overflow', 'hidden');
        var parentHeight = parent.offsetHeight;
        var elementHeight = element.offsetHeight;

        // set top margin
        var topMargin = (parentHeight - elementHeight) / 2;
        $(element).css('margin-top', topMargin + 'px');

        return true;
    }
};

