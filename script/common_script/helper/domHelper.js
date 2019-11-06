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

