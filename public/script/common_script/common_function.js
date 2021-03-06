/**
 * common function
 * recommend use single page app framework and quote all required libraries.
 * It's use in non-single page
 * @author: Kevin Kwan
 * E-mail: zhiwen2720@163.com
 * url: https://github.com/xiaowen0/Web-Common-Style-And-Script
 */

var dependencies = ['jquery', 'moment'];

var cdnList = {
    'china' : {
        html5shiv : 'https://cdn.bootcss.com/html5shiv/r29/html5.min.js',
        bootstrap : 'https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css',
        boorstrapTheme : 'https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap-theme.min.css',
        jquery : 'https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js',
        momentWithLocales : 'https://cdn.bootcss.com/moment.js/2.18.1/moment-with-locales.min.js'
    },
    'world' : {
        html5shiv : 'https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js',
        bootstrap : 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css',
        bootstrapTheme : 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap-theme.min.css',
        jquery : 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js',
        momentWithLocales : 'http://momentjs.com/downloads/moment-with-locales.min.js'
    }
};

/* --- Number function group --------------------------------------- */

function fixFloatingPointNumber(number, bit) {

    var numberStr = new String(number);
    if (numberStr.indexOf('.') < 0) // no point, fill 0
    {
        return numberStr + '.' + repeatString('0', bit);
    }

    var a1 = numberStr.split('.');  a1[1].length;

    if (a1[1].length < bit)
    {
        a1[1] += repeatString('0', bit - a1[1].length);
    }
    else if (a1[1].length > bit)
    {
        a1[1] = a1[1].substr(0, bit);
    }

    return a1.join('.');
}

/**
 * random generate a integer number
 * @param  Number  length
 * @return Number
 */
function getRandomInteger(length)
{
    return (Math.floor(Math.random() * length));
}

/* --- debug function group ------------------------------------------ */

/**
 * enable debug mode
 * @return  boolean
 */
function enableDebug()
{
    try {
        // current browser not support sessionStorage
        if (typeof(sessionStorage) != 'object') {
            return false;
        }

        sessionStorage.setItem("debug", 'on');
        return true;
    }
    catch (e) {
        return true;
    }
}
var openDebug = enableDebug;

/**
 * disable debug mode
 * @return  boolean
 */
function disableDebug()
{
    try {
        // current browser not support sessionStorage
        if (typeof(sessionStorage) != 'object') {
            return false;
        }

        sessionStorage.setItem("debug", 'off');
        return true;
    }
    catch (e) {
        return false;
    }
}
var closeDebug = disableDebug;

/**
 * get debug status
 * @returns boolean
 */
function getDebugStatus()
{
    try {
        if (typeof(sessionStorage) != 'object') {
            return false;
        }
        return sessionStorage.getItem('debug') === 'on';
    }
    catch (e) {
        return false;
    }
}

/**
 * add console log
 * @param   text    String
 * @returns boolean
 */
function addConsoleLog(text)
{
    try {
        if (typeof(console) != 'object') {
            return false;
        }

        console.log(text);
        return true;
    }
    catch (e) {
        return false;
    }
}

/**
 * add debug log
 * @param   text    String
 * @returns boolean
 */
function addDebugLog(content)
{
    if (!getDebugStatus())
    {
        return false;
    }

    if (typeof (content) === 'string')
    {
        addConsoleLog('[debug] ' + content);
    }
    else
    {
        addConsoleLog(content);
    }
    return true;
}
var log = addDebugLog;

/**
 * add error log
 * @param   text    String
 * @returns boolean
 */
function addErrorLog(text)
{
    if (getDebugStatus()) {
        addConsoleLog('[error] ' + text);
        return true;
    }
    else {
        return false;
    }
}

/**
 * alert debug log
 * @param   text    String
 * @returns boolean
 */
function alertDebugLog(text)
{
    if (getDebugStatus()) {
        alert('[debug] ' + text);
        return true;
    }
    else {
        return false;
    }
}

/**
 * add debug information
 * @param text  String
 * @param type  String
 */
function addDebugInfo(text, type)
{
    var infoType = type ? type : 'info';

    if ( !$('#debugInfoDialog').length )
    {
        addConsoleLog('[warnning] element: #debugInfoDialog not exist.');
        return;
    }

    var fulltext = '[' + infoType + '] ' + text;
    var info = '<p>' + fulltext + '</p>';
    $('#debugInfoDialog .infoContainer').append(info);
}

/**
 * update object's properties
 * @param   Object  object
 * @param   Object  data    new properties
 */
function updateObject(object, data)
{
    for (var key in data)
    {
        object[key] = data[key];
    }
}

/**
 * print object info to page.
 * @param object  Object
 */
function printObject(object)
{
    var info = createElement('div');
    var list = createElement('ul');

    for (var name in object)
    {
        var property = createElement('li');
        property.innerHTML   = name + ': ' + object[name];
        list.appendChild(property);
    }

    info.appendChild(list);
    document.body.appendChild(info);
}

/**
 * clone object
 * @param   Object  object
 * @return  Object
 */
function cloneObject(object)
{
    var newObject = new Object();

    for (var name in object)
    {
        newObject[name] = object[name];
    }

    return newObject;
}

/**
 * clone array
 * @param Array array
 * @returns Array
 */
function cloneArray(array)
{
    var newArray = new Array();

    for (var index in array)
    {
        newArray[index] = typeof(array[index]) == "object" ? cloneArray(array[index]) : array[index];
    }

    return newArray;
}

/**
 * merge 2 object to a new object
 * @param   Object  obj1
 * @param   Object  obj2
 * @return  Object
 */
function mergeObject(obj1, obj2)
{
    var newObject = new Object();

    var name;
    for (name in obj1)
    {
        newObject[name] = obj1[name];
    }
    for (name in obj2)
    {
        newObject[name] = obj2[name];
    }

    return newObject;
}

/**
 * get object property by key path, it can visit deep property.
 * @example getObjectPropertyByKeyPath(product, 'category.name')
 * @param   Object          object
 * @param   String|Array    path
 */
function getObjectPropertyByKeyPath(object, path)
{
    if (path === '')
    {
        addConsoleLog('path can not be a empty string.');
        return null;
    }
    var pathQueue = typeof(path) === 'string' ? path.split('.') : path;
    if (typeof(object[pathQueue[0]]) === 'undefined')
    {
        return null;
    }

    var property = object[pathQueue[0]];
    pathQueue.shift();

    if (pathQueue.length)
    {
        return getObjectPropertyByKeyPath(property, pathQueue);
    }

    return property;
}

/**
 * set object property by key path, it can set deep property.
 * @example setObjectPropertyByKeyPath(product, 'category.name', 'cat')
 * @param   Object  object
 * @param   String  path
 * @param   *       value
 */
function setObjectPropertyByKeyPath(object, path, value)
{
    if (path === '')
    {
        addConsoleLog('path can not be a empty string.');
        return null;
    }

    var pathQueue = path.split('.');

    var t = null;
    var tNode = object;

    // loop into next level
    for (var i=0; i<pathQueue.length; i++)
    {
        var tKey = pathQueue[i];

        // not leaf node, it must a object
        if (i+1 < pathQueue.length)
        {
            // not a object, then create one.
            if ( typeof (tNode[tKey]) === 'undefined' )
            {
                tNode[tKey] = {};
            }

            // point to next level
            tNode = tNode[tKey];
        }
        else    // leaf node, set value
        {
            tNode[tKey] = value;
        }
    }
}

/**
 * set debug's content
 * @param content  String|Array   content name or array of content name
 * @returns boolean
 */
function setDebuggingContent(content)
{
    if (typeof(content)=="object")
    {
        content = content.join('|');
    }

    try {
        if (typeof(sessionStorage) != 'object') {
            return false;
        }
        return sessionStorage.setItem('debugging_content', content);
    }
    catch (e) {
        return false;
    }
}

/**
 * check if exist debugging content
 * @param name  String
 * @return boolean
 */
function existDebuggingContent(name)
{
    try {
        if (typeof(sessionStorage) != 'object') {
            return false;
        }
        var debuggingContentString = sessionStorage.getItem('debugging_content');
        if (!debuggingContentString)
        {
            return false;
        }
        var debuggingContentList = debuggingContentString.split('|');
        return inArray(name, debuggingContentList);
    }
    catch (e) {
        return false;
    }
}

/* browser feature group --------------------------------------------------------- */

/**
 * get browser finger printing
 * it use different canvas algorithm of browser to generate different image code
 * use this code can classify browser, then prevent user agent is altered.
 * @return String
 */
function getBrowserFingerPrinting()
{
    // create canvas element
    var canvas = document.createElement('canvas');

    if (typeof(canvas.getContext) === "undefined")
    {
        addConsoleLog("Not support browser finger printing on current browser.");
        return "";
    }

    var ctx;
    try
    {
        ctx = canvas.getContext('2d');
    }
    catch (e)
    {
        addConsoleLog(e);
        return "";
    }

    // write host name
    var txt = "http://" + location.hostname;
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = location.hostname;
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);

    return canvas.toDataURL();
}

/* page content group */

/**
 * get page's description from meta tag
 * @return  String
 */
function getPageDescription()
{
    var descMetaTag = document.getElementsByName('description');
    if (!descMetaTag.length)
    {
        return '';
    }

    return descMetaTag[0].content;
}
var getPageDesc = getPageDescription;

/**
 * get page's icon from link tag
 * @return  String
 */
function getPageIcon()
{
    var iconLinkTag = document.getElementsByName('icon');
    if (!iconLinkTag.length)
    {
        return '';
    }

    return iconLinkTag[0].href;
}

/* --- String function group ---------------------------------------------------------- */

/**
 * repeat string
 * @param String  string
 * @param Number  times
 */
function repeatString(string, times)
{
    var result = "";

    for (var i=1; i<=times; i++)
    {
        result += string;
    }

    return result;
}

/**
 * replace string
 * @param string  String  The string being searched and replaced on.
 * @param find    String  The value being searched for.
 * @param replace String  The replacement value that replaces found search values.
 * @returns String
 */
function str_replace(string, find, replace)
{
    if (find == replace) {
        return string;
    }

    var limit = 10000;
    var count = 0;

    if (replace.indexOf(find) >= 0)
    {
        console.error('[error] replace string include finding string.');
        return string;
    }

    var oStr = new String(string);
    while (oStr.indexOf(find) >= 0 && count < limit) {
        oStr = oStr.replace(find, replace);
        count++;
    }
    return oStr;
}

/**
 * replace some data with key
 * @param string String
 * @param data Object  key-value pairs
 * @returns String
 */
function replaceData(string, data)
{
    for (var p in data) {
        while (string.indexOf(p) >= 0) {
            string = string.replace(p, data[p]);
        }
    }

    return string;
}

/**
 * convert different columns name of object
 * example: {created_date : 123, user_name : 'abc'} => {createdDate : 123, userName : 'abc'}
 * @param  Object  data
 * @param  Object  mapping of columns: newProperty => oldProperty
 * @return Object
 */
function dataColumnConvert(data, mapping)
{
    var newData = {};

    // clone all properties
    for (var key in data)
    {
        newData[key] = data[key];
    }

    // change property in mapping
    for (var mapKey in mapping)
    {
        newData[mapKey] = newData[mapping[mapKey]];
        delete newData[mapping[mapKey]];
    }

    return newData;
}

/**
 * convert a list of object's different columns name
 * example: [{created_date : 123, user_name : 'abc'}] => [{createdDate : 123, userName : 'abc'}]
 * @param  Array   list
 * @param  Object  mapping of columns: newProperty => oldProperty
 * @return Object
 */
function listDataColumnConvert(list, mapping)
{
    var newList = [];
    for (var i=0; i<list.length; i++)
    {
        var newItem = dataColumnConvert(list[i], mapping);
        newList.push(newItem);
    }

    return newList;
}

/**
 * filter items from list according to object's property.
 * @param   Array   list
 * @param   String  name    property name
 * @param   Mixed   value   property value
 * @return Array
 */
function listDataFilter(list, name, value)
{
    var newList = [];
    for (var i=0; i<list.length; i++)
    {
        if (list[i][name] === value)
        {
            newList.push(list[i]);
        }
    }
    return newList;
}

/**
 * first letter upper case
 * @param string  String
 * @returns String
 */
function firstLetterUpperCase(string)
{
    if (string.length == 0)
    {
        return string;
    }
    var firstLetter = string[0].toUpperCase();
    string = firstLetter + string.substring(1, string.length);

    return string;
}

/**
 * get random chinese name
 * @return String
 */
function getRandomChineseName()
{
    var surnameList = [
        '赵','钱','孙','李','周','吴','郑','王',
        '冯','陈','褚','卫','蒋','沈','韩','杨',
        '朱','秦','尤','许','何','吕','施','张',
        '孔','曹','严','华','金','魏','陶','姜'
    ];

    var secondWordList = ['云','化','京','彦','小','志','书','健','思','嘉','明'];

    var thirdWordList = ['腾','东','宏','龙','川','东','福','林','聪','诚','珠'];

    var surname     = surnameList[Math.ceil(Math.random() * (surnameList.length - 1))];
    var secondWord  = secondWordList[Math.ceil(Math.random() * (secondWordList.length - 1))];
    var thirdWord   = thirdWordList[Math.ceil(Math.random() * (thirdWordList.length - 1))];

    var fullname = surname + secondWord + thirdWord;
    return fullname;
}

/**
 * remove line-break char
 * @param  String  string
 * @return String
 */
function removeLineBreak(string)
{
    return string.replace(/[\r\n]/g, '');;
}

/**
 * remove space char
 * @param  String  string
 * @return String
 */
function removeSpace(string)
{
    return string.replace(/\ +/g,"");
}

/**
 * remove all html tag in html code
 * @param   String  html  HTML code
 * @returns String
 */
function removeHtmlTag(html)
{
    return html.replace(/<[^<>]+?>/g, '');//删除所有HTML标签
}

/**
 * filter img tag from html code
 * @param   String  html code
 * @return  Array
 */
function filterImgTag(html)
{
    return new RegExp("<img[^>]*>").exec(html);
}

/**
 * filter image url list from html code
 * @param   String  html code
 * @return  Array
 */
function filterImageUrlList(html)
{
    var tempEle = $(html);
    var imageList = tempEle.find('img');
    var urlList = [];

    for (var i=0; i<imageList.length; i++)
    {
        urlList.push(imageList.eq(i).attr('src'));
    }

    return urlList;
}

/**
 * escape html code
 * @param   String html
 * @returns String
 */
function escapeHtml(html)
{
    return html.replace(/[<>&"]/g, function (c)
    {
        return {'<' : '&lt;', '>' : '&gt;', '&' : '&amp;', '"' : '&quot;'}[c];
    });
}

/**
 * encode html
 * @param String  str
 * @returns String
 */
function EncodeHtml(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br/>");
    return s;
}

/**
 * decode html
 * @param String  str
 * @returns String
 */
function DecodeHtml(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br\/>/g, "\n");
    return s;
}

/**
 * remove space in ahead of line
 * @param String|Array  single string or array of string
 * @returns String|Array
 */
function removeSpaceInAheadOfLine(string)
{
    var type = typeof(string);
    var stringList = (type == "object") ? string : [string];
    for (var i=0; i<stringList.length; i++)
    {
        stringList[i] = stringList[i].replace(new RegExp('^( )+'), '');
    }
    return (type == "object") ? stringList : stringList[0];
}

/**
 * get a object in list by key
 * @param  Array  list
 * @param  String  key
 * @param  Mixed  value
 * @returns  null|Object
 */
function getObjectInListByKey(list, key, value)
{
    for (var i=0; i<list.length; i++)
    {
        var tItem = list[i];
        if ( typeof(tItem[key]) !== 'undefined' && tItem[key] === value)
        {
            return tItem;
        }
    }
    return null;
}

/**
 * convert a object or array to string
 * @param data  Object|Array
 * @returns mixed
 */
function data2String(data)
{
    var text = '';

    if (typeof(data) === 'object') {
        for (var i in data) {
            text += i + ': ' + data[i] + '  ';
        }
        return text;
    }
    else if (typeof(data) === 'array') {
        for (var i = 0; i < data.length; i++) {
            text += data[i];

            if (i + 1 < data.length) {
                text += ', ';
            }
        }
        return text;
    }

    return data;
}

/**
 * parse a BBCode (Bulletin Board Code) string, return a structural data.
 * @param  String  bbcode
 * @return  Object
 * - String  htmlCode  html code string
 * - String  plainText  no any html tag
 * - String  imageList  image url list from source code
 */
function BBCodeToStructuralData(bbcode)
{
    if (typeof(sceditor) == 'undefined')
    {
        addConsoleLog('BBCodeToStructuralData require sceditor library.');
        return;
    }
    var result = {};
    result.htmlCode     = new sceditor.BBCodeParser().toHTML(bbcode);
    result.plainText    = removeHtmlTag(result.htmlCode);
    result.imageList    = filterImageUrlList(result.htmlCode);
    return result;
}

/**
 * set current page's address url
 * @param String  url  relative path or absolute path
 * note: url must same source
 */
function setCurrentUrl(url)
{
    window.history.pushState({},'',url);
}

/**
 * create url with params
 * @param String url
 * @param Object params
 * @return String
 */
function createUrl(url, params)
{
    if (typeof(params) !== 'object')
    {
        return url;
    }

    var param_string = '';

    for (var name in params) {
        param_string.length ? param_string += '&' : null;

        param_string += name + '=' + params[name];
    }

    if (url.indexOf('?') >= 0)
    {
        url += '&';
    }
    else {
        url += '?';
    }
    url += param_string;

    return url;
}

/**
 * get file name from a url string
 * @param    String url
 * @return   String
 */
function getUrlFileName(url)
{
    var paths = url.split('/');
    return paths[paths.length-1];
}

/**
 * get body html from html code
 * @param  String  html
 * @return String|false
 */
function getBodyHtml(html)
{
    try {
        var splitResult = html.split(/\<body[^\>]*\>/);
        if (splitResult.length < 2) {
            log('can not found string: /\<body[^\>]*\>/');
            return false;
        }
        html = splitResult[1].replace('</body>', '');
    }
    catch (e) {
        log(e);
        return false;
    }

    return html;
}

/**
 * check a path if root
 * @param String path
 * @returns boolean
 */
function isRootPath(path)
{
    // remove last / char
    if (path.lastIndexOf('/') == path.length - 1) {
        path = path.substr(0, path.length - 1);
    }

    // no parent
    if (path == '/' || path.length == 0) {
        return true;
    }

    return false;
}

/**
 * get the parent folder url by url
 * @param String url
 * @returns String
 * example:
 * 'abc' => ''
 * 'abc/dfg' => 'abc'
 * './abc/dfg' => './abc'
 */
function getParentFolder(url)
{
    // remove last / char
    if (url.lastIndexOf('/') == url.length - 1) {
        url = url.substr(0, url.length - 1);
    }

    // no parent
    if (url.lastIndexOf('/') < 0 || url.lastIndexOf('/') == 0) {
        return '';
    }

    return url.substr(0, url.lastIndexOf('/'));
}

/**
 * adjust url
 * remove parent directory string
 * @param String url
 * @returns String
 */
function adjustUrl(url)
{
    var stack = [];
    var paths = url.split("/");
    for (var i = 0; i < paths.length; i++) {
        if (paths[i] === '.') {
            continue;
        }

        if (paths[i] === "..") {
            stack.pop();
        }
        else {
            stack.push(paths[i]);
        }
    }
    var nurl = stack.join("/");
    return nurl;
}

/**
 * concat path string
 * @param String path1
 * @param String path2
 * @return String
 */
function concatPath(path1, path2)
{
    // complement separator in the end of path
    if (path1.substr(-1, 1) != '/');
    {
        path1 += '/';
    }

    // remove separator in the head of path
    if (path2.substr(0, 1) === '/') {
        path2 = path2.substr(1, path2.length);
    }

    return path1 + path2;
}

/**
 * simplify path
 * remove current directory string and current directory string
 * @param String url
 * @returns String
 */
function simplifyPath(url)
{
    // current directory string
    url = url.split('/./').join('/');
    if (url.substr(0, 2) == './') {
        url = url.substr(2, url.length);
    }

    // remove parent directory expression string
    var rule1 = new RegExp('([^\/]*)\/..\/');
    while (url.search(rule1) >= 0) {
        url = url.replace(rule1, '');
    }

    return url;
}

/**
 * get absolute base url like: http://www.example.com/
 * @return String
 */
function getAbsoluteBaseUrl()
{
    var protocol = location.protocol;
    var hostname = location.hostname;
    var port = location.port;

    var url = protocol + "//" + hostname;
    if (port != 80 || port != 443)
    {
        url += ":" + port;
    }
    url += "/";
    return url;
}

/* --- Array function group ------------------------------------------ */

/**
 * check if a value in array  检查数组是否存在某个值
 * @param mixed  value
 * @param Array  array data
 * @returns boolean
 */
function inArray(value, array)
{
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return true;
        }
    }
    return false;
}

/**
 * get array index by element in a array
 * @param  Array  array
 * @param  Mixed  element
 * @return Number  if not found, then return -1
 */
function getIndexInArray(array, element)
{
    for (var i = 0; i<array.length; i++)
    {
        if (array[i] === element)
        {
            return i;
        }
    }

    return -1;
}

/**
 * remove an element from a array
 * @param  Array  array
 * @param  Mixed  element
 * @returns {Array}
 */
function removeArrayElement(array, element)
{
    var newArray = new Array();

    for (var i=0; i<array.length; i++)
    {
        if (array[i] == element)
        {
            continue;
        }

        newArray.push(array[i]);
    }

    return newArray;
}

/**
 * get item in a list by id
 * @param  Array  list
 * @param  String  id
 * @return {null|*}
 */
function getItemInListById(list, id) {
    for (var i=0; i<list.length; i++)
    {
        if (list[i].id === id)
        {
            return list[i];
        }
    }

    return null;
}

/**
 * get item in a list by column
 * @param  Array  list
 * @param  String  columnName
 * @param  String  value
 * @return {null|Object}
 */
function getItemInListByColumn(list, columnName, value) {
    for (var i=0; i<list.length; i++)
    {
        if (list[i][columnName] === value)
        {
            return list[i];
        }
    }

    return null;
}

/* --- Time function group ------------------------------------------ */

/**
 * get fresh text
 * @param time_str  time text (2016-01-31 12:00:00)
 * @returns String
 * require moment-with-locales library
 */
function getFreshText(time_str)
{
    try {
        var time = moment(time_str);
        return time.fromNow();
    }
    catch (e) {
        addConsoleLog(e);
    }

    return '';
}

/**
 * format time
 * @param String format like "YYYY-MM-DD HH:mm"
 * @param Number|Date   millisecond or date object
 * @return String
 * require  moment library
 */
function formatTime(format, time)
{
    if (!time)
    {
        return "";
    }

    var dateObj = typeof(time) === "object" ? time : new Date(time);

    return moment(dateObj).format(format);
}

/**
 * get am or pm
 * @param   String|Date|Number  time expression or date object or timestamp(millsecond)
 * @param   String  string format for time expression
 * @return  String  am or pm or empty string
 * require  moment library
 */
function getAMPM(time, format)
{
    if (!format) {
        format = 'YY-MM-dd HH:mm:ss';
    }

    switch (typeof(time)) {
        case 'object' :
            try {
                return time.getHours() < 12 ? 'am' : 'pm';
            }
            catch (e) {
                addConsoleLog(e);
            }
        case 'number' :
            var oDate = new Date(time);
            return oDate.getHours() < 12 ? 'am' : 'pm';
        case 'string' :
            var oMoment = moment(time, format);
            return parseInt(oMoment.format('H')) < 12 ? 'am' : 'pm';
    }

    return '';
}

/**
 * format time lenth
 * @example  90 -> 01:30,  9000 -> 02:30:00,  1500000 -> 416:40:00
 * @Param  Float  seconds
 * @Param  Object  options
 * -- Boolean  integer
 * @return  String
 */
function formatTimeLength(seconds, options)
{
    // options
    options ? null : options = {};
    var integer = options.integer || false;

    if (integer)
    {
        seconds = Math.floor(seconds);
    }

    // calculate hour, minute, second
    // hourPart * 60^2 + minutePart * 60 + secondPart = seconds
    var secondPart  = seconds % 60;
    var minutePart  = Math.floor(seconds / 60) % 60;
    var hourPart    = Math.floor(seconds / 60 / 60);

    // combine expression
    var text = '';
    text = (secondPart >= 10 ? secondPart : '0' + secondPart) + text;
    text = ':' + text;
    text = (minutePart >= 10 ? minutePart : '0' + minutePart) + text;
    if ( hourPart>0 )
    {
        text = ':' + text;
        text = (hourPart >= 10 ? hourPart : '0' + hourPart) + text;
    }

    return text;
}

/**
 * parse time structure from a timestamp
 * @param   Number  seconds     millsecond timestamp
 * @return  Object
 */
function parseTimeStructure(millsecond)
{
    var time = millsecond;
    var result = {};

    var t = 0;  // each data from millsecond, second, minute, hour

    t = time % 1000;
    result.SS   = t < 10 ? '0' + t : t + '';
    result.S    = t + '';
    time -= t;
    time = Math.floor(time / 1000);

    t = time % 60;
    result.ss   = t < 10 ? '0' + t : t + '';
    result.s    = t + '';
    time -= t;
    time = Math.floor(time / 60);

    t = time % 60;
    result.mm   = t < 10 ? '0' + t : t + '';
    result.m    = t + '';
    time -= t;
    time = Math.floor(time / 60);

    t = time;
    result.HH   = t < 10 ? '0' + t : t + '';
    result.H    = t + '';

    return result;
}

/* timer function group -------------------------------------------- */

/**
 * print time string in a wrapper
 * it will refresh time per second
 * @param element   HTMLElement|String      HTML element or CSS path string
 * @param format    String                  date time format expression
 * require moment-with-locales library
 */
function printTime(element, format)
{
    if (!format) {
        format = $(element).data('format') || 'YYYY-MM-DD H:mm:ss';
    }

    // update per minute
    setInterval(function ()
    {
        try {
            var current_time_string = moment().format(format);
            $(element).html(current_time_string);
        }
        catch (e) {
            addConsoleLog(e);
        }
    }, 1000);
}

/**
 * get now time
 * @param String  format
 * @return String
 */
function getNowTime(format)
{
    if (!format)
    {
        format = 'YYYY-MM-DD HH:mm:ss';
    }

    return moment().format(format);
}

/**
 * set a number count backwards
 * @param Object(HTMLElement)  element
 * @param Object               options
 */
function countBackwards(element, options)
{
    typeof (options) == 'object' ? null : options = {};
    var callback = options.callback || null;

    // get the number
    var number = parseInt(element.innerHTML);

    // set timer to count
    var timer = setInterval(function ()
    {
        try {
            var number = parseInt(element.innerHTML);

            number--;
            element.innerHTML = number;

            if (number <= 0) {
                clearInterval(timer);
                callback ? callback(element) : null;
            }
        }
        catch (e) {
            log(e);
        }
    }, 1000);
}

/**
 * set time drop as a element's content
 * @param Object(HTMLElement)|String    element node or CSS selector string
 * @param Number|String|Object(Date)    endTime     Unix Millisecond Timestamp, or time expression, or Date object.
 * @param Object                        options
 * -- format    String      display format like: 'HH:mm:ss'
 * -- callback  Function
 * @requires moment.js
 */
function timeDrop(element, endTime, options)
{
    typeof (options) === 'object' ? null : options = {};
    if (typeof(element) === 'string')
    {
        element = $(element).length ? $(element)[0] : null;
    }
    if (!element)
    {
        return;
    }

    var format      = options.format || 'HH:mm:ss';
    var callback    = options.callback || null;

    if (typeof(endTime) === 'string')
    {
        endTime = parseInt(moment(endTime, format).format('x'));
    }
    else if (endTime instanceof Date)
    {
        endTime = endTime.getTime();
    }

    var time = 0-(moment().diff(new Date(endTime), 'millisecond'));
    var timeStructure = parseTimeStructure(time);
    var text = replaceData(format,timeStructure);
    element.innerHTML = text;

    // set timer to count
    var timer = null;
    timer = window.setInterval(function ()
    {
        time = 0-(moment().diff(new Date(endTime), 'millisecond'));
        var timeStructure = parseTimeStructure(time);
        var text = replaceData(format,timeStructure);
        element.innerHTML = text;

        if (time <= 0) {
            window.clearInterval(timer);
            callback ? callback(element, time, options) : null;
        }

    }, 1);
}

/**
 * set a element include number count backwards
 * @param Object(HTMLElement)|String  element    element object or css selector string
 * @param Object                      options
 * -- process   String      process text string with {n}
 * -- finish    String      finish text string
 * -- second    String      count backwards seconds
 * -- callback  Function    finish callback
 */
function setCountBackwards(element, options)
{
    // check jQuery library
    if (typeof($) === 'undefined') {
        log('[error] missing $ function.');
        return false;
    }

    var elementQuote = $(element);

    // check options param
    typeof (options) === 'object' ? null : options = {};

    // save default text
    var defaultText = elementQuote.html();
    elementQuote.data('default', defaultText);

    // get process text
    var processText = options.process || elementQuote.data('process');

    // get finish text
    var finishText = options.finish || elementQuote.data('finish');

    // get callback
    var callback = options.callback || null;

    // get second
    var second = options.second || parseInt(elementQuote.data('second')) || 60;

    if (second <= 0) {
        addConsoleLog('[error] setCountBackwards must give a second param.');
        return;
    }

    log('second=' + second);

    var timer = null;

    var update = (function ()
    {
        try {
            second--;

            // update content
            elementQuote.html(processText.replace('{n}', second));

            if (second <= 0) {
                // set finish text
                elementQuote.html(finishText);

                // clear timer
                clearInterval(timer);

                // callback
                callback ? callback(element) : null;
            }
        }
        catch (e) {
            log(e);
        }
    });

    update();
    // set timer to count
    timer = setInterval(update, 1000);
}

/* --- element function group ------------------------------------------ */

/**
 * get element by id  根据ID获取元素
 * @param id String  element ID
 * @returns Object(HTMLElement) | null
 */
function getElement(id)
{
    return document.getElementById(id);
}

/**
 * get elements
 * @param selector  CSS query selector
 * @returns {*}
 */
function get(selector)
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
}

/**
 * create element  创建元素
 * @param name     String  element name
 * @param options  Object  element attributes
 * @param content  Object of HTMLElement | String  element content
 * @returns Object(HTMLElement) | false
 */
function createElement(name, options, content)
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
}

/**
 * generate a unique id for a element, the result is like "element_n" (n is a natural number) format.
 * @param   String  name        element type name, default: "element"
 * @param   String  delimiter   default: "_"
 * @return  String
 */
function generateIdForElement(name, delimiter)
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
}

/**
 * get target data-* value in a event handler
 * @param   Object  event
 * @param   String  name
 * @return  String
 */
function getTargetDataByEvent(event, name)
{
    var target = event.currentTarget;
    if (typeof(target.dataset[name]) != 'undefined')
    {
        return target.dataset[name];
    }

    return '';
}

/**
 * print tag  输出一个 HTML 标记
 * @param name     String  element name
 * @param options  Object  element attributes
 * @param content  Object of HTMLElement | String  element content
 */
function printTag(name, options, content)
{
    var element = createElement(name, options, content);
    document.writeln(element.outerHTML);
}

/**
 * print stylesheet link
 * @param url  String
 */
function printStylesheetLink(url)
{
    document.writeln('<link rel="stylesheet" href="' + url + '"/>');
}

/**
 * load style sheet
 * @param url  String  url to style sheet file.
 * @return  String  absolute path for file url
 */
function loadStylesheet(url)
{
    var stylesheetLink = createElement('link', {
        href : url,
        rel : "stylesheet"
    });
    document.head.appendChild(stylesheetLink);
    return stylesheetLink.href;
}

/**
 * set a element middle position in his parent
 * @param  String|Array  element CSS selector path or array
 * @returns boolean
 */
function setElementMiddlePosition(element)
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

/**
 * check a url if is CSS file
 * @param  String  url
 * @return Boolean
 */
function isCSSFile(url)
{
    return url.substr(-4) == '.css';
}

/**
 * load script
 * @param url  String  url to script file.
 * @param options  Object  options for this action
 * - onload  Function
 * @return  String  absolute path for file url
 */
function loadScript(url, options)
{
    options = options || {};

    var scriptLink = createElement('script', {
        src : url
    });

    var onload = options.onload || (function(){});
    if (onload)
    {
        scriptLink.onload = onload;
    }

    document.body.appendChild(scriptLink);
    return scriptLink.src;
}

/**
 * execute script from a file
 * @param String    url
 * @param Function  callback
 * -- Object|null   error   a object save error information
 * -- String        text    script text content
 */
function execScript(url, callback)
{
    $.ajax(url, {
        dataType : 'text',
        success : function (text)
        {
            try
            {
                eval(text);
            }
            catch (e)
            {
                callback(e, '');
            }

            if (callback)
            {
                callback(null, text);
            }
        },
        error : function (request, message){
            if (callback)
            {
                callback({
                    request : request,
                    message : message
                }, '');
            }
        }
    });
}

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
function loadContent(options)
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
}

/**
 * load some data from api
 * example: api return value: {data: {name:'name', 'score':100}}, it can set data to object's property: name and score .
 * @param   Object  options         api options
 * @param   Object  object          api options
 * @param   Array   targetKeyList   key path for property by object, like: ['data.name', data.score]
 * @param   Array   sourceKeyList   api result key path list, like: ['data.name', 'data.score']
 * @param   Function    callback
 */
function loadDataFromApiToObject(options, object, targetKeyList, sourceKeyList, callback)
{
    if (typeof (options.type) === 'undefined')
    {
        options.type = options.method || 'get';
    }

    typeof (targetKeyList) === 'undefined' ? targetKeyList = [] : null;

    options.success = (function(result){

        if (targetKeyList.length === 0)
        {
            updateObject(object, result);
        }
        else
        {
            for (var i=0; i<targetKeyList.length; i++)
            {
                var tValue = getObjectPropertyByKeyPath(result, sourceKeyList[i]);
                setObjectPropertyByKeyPath(object, targetKeyList[i], tValue);
            }
        }

        callback ? callback() : null;

    });

    $.ajax(options);
}

/**
 * download a file, not display in window
 * @param url  String
 */
function downloadFile(url)
{
    if (isIE())
    {
        var imageWindow = window.open(url);
        imageWindow.onload = (function()
        {
            // open design mode
            // reference: https://developer.mozilla.org/zh-CN/docs/Web/API/Document/designMode
            try
            {
                this.document.designMode = "ON";
            }
            catch(e)
            {
                addConsoleLog(e.message);
            }

            try
            {
                // only IE support SaveAs action
                this.document.execCommand("SaveAs");
                this.close();
            }
            catch(e)
            {
                addConsoleLog(e.message);
            }
        });
        try
        {
            if (imageWindow.document.readyState == "complete")
            {
                imageWindow.onload();
            }
        }
        catch(e)
        {
            addConsoleLog(e.message);
            imageWindow.onload();
        }
    }
    else
    {
        var linkElm = createElement('a', {
            href : url,
            target : '_blank',
            download : ''
        });
        linkElm.style.display = 'none';
        document.body.appendChild(linkElm);
        linkElm.click();
        linkElm = null;
    }

}

/**
 * set element height equal to width  设置元素高度等于宽度
 * @param element Object of HTMLElement
 */
function setHeightEqualToWidth(element)
{
    element.style.height = element.offsetWidth + "px";
}

/**
 * load external data for image
 * @param   HTMLElement|String  element     image element quote or css query string, it can be set 'data-baseurl' attr for link base url.
 * @param   Object  apiConfig
 * - url            String  required
 * - method         String  default 'GET'
 * - dataPath       String
 * - dataMapping    Object  example: {'src' : 'imageUrl'}
 * @requires    jQuery
 */
function imageLoadData(element, apiConfig, callback)
{
    $.ajax({
        url : apiConfig.url,
        type : apiConfig.method || 'get',
        data : apiConfig.params || {},
        success : function (result) {

            var dataPath = apiConfig.dataPath || '';
            var dataMapping = apiConfig.dataMapping || {};

            // get data and convert columns
            var data = dataPath ? getObjectPropertyByKeyPath(result, dataPath) : result;
            data = dataColumnConvert(data, dataMapping);

            var imageQuote = $(element);

            var baseUrl = imageQuote.attr('data-baseurl') || '';

            // set src attr
            imageQuote.attr('src', baseUrl + data.src);

            // set prototype attribute and data attribute
            var imageAttrs = ['width', 'height', 'alt', 'title'];
            for(var key in data)
            {
                if (inArray(key, imageAttrs))
                {
                    imageQuote.attr(key, data[key]);
                }
                else
                {
                    imageQuote.attr('data-' + key, data[key]);
                }
            }

            // check link and set click action
            if (typeof(data.link) !== 'undefined')
            {
                imageQuote.on('click', function() {
                    var baseUrl = this.dataset['data-baseurl'] || '';
                    var link = this.dataset['data-link'] || '';
                    if (link)
                    {
                        location.href = baseUrl + link;
                    }
                });
            }

            callback ? callback(null, data) : null;
        },
        error : function (error) {
            callback ? callback(error, null) : null;
        }
    })
}

/**
 * reload image
 * @param HTMLElement image
 */
function reloadImage(image)
{
    var src = image.src;
    var url = src.split('?')[0];
    var newUrl = createUrl(url, {
        t : new Date().getTime().toString().substring(-4, 4)
    });
    image.src = newUrl;
}

/**
 * set image fill
 * @param   image   Object(HTMLImageElement)    image element
 */
function setImageFill(image)
{
    image.onload = (function ()  // set 'onload' event
    {
        // get parent inner size
        var wrapper_width = $(this.parentNode).innerWidth();
        var wrapper_height = $(this.parentNode).innerHeight();

        this.style.width = '100%';
        this.style.height = 'auto';

        // wrapper has height limit and image height less than warpper height
        if (wrapper_height > 0 && this.height < wrapper_height) {
            this.style.width = 'auto';
            this.style.maxWidth = 'none';
            this.style.height = '100%';
        }

    });

    // check if loaded
    if (image.width > 0 && image.height > 0) // already loaded
    {
        image.onload();
    }

}

/**
 * check a url if is CSS file
 * @param  String  url
 * @return Boolean
 */
function isCSSFile(url)
{
    return url.substr(-4) == '.css';
}

/**
 * check a url if is script type file
 * @param  String  url
 * @return Boolean
 */
function isScriptFile(url)
{
    var scriptTypeList = ['js'];

    for (var i=0; i<scriptTypeList.length; i++)
    {
        // each ext name in scriptTypeList
        var tExtStr = '.' + scriptTypeList[i];
        if (url.substr(0 - tExtStr.length) == tExtStr)
        {
            return true;
        }
    }
    return false;
}

/**
 * check a file name is image format
 * @param   String  file name
 * @return  boolean
 */
function isImage(name)
{
    formatList = ["jpg","jpeg","png","gif","svg"];
    for (var i=0; i<formatList.length; i++)
    {
        if (name.substr(0-formatList[i].length) === formatList[i])
        {
            return true;
        }
    }

    return false;
}

/**
 * check a file name is video format
 * @param   String  file name
 * @return  boolean
 */
function isVideo(name)
{
    formatList = ["webm","mp4"];
    for (var i=0; i<formatList.length; i++)
    {
        if (name.substr(0-formatList[i].length) === formatList[i])
        {
            return true;
        }
    }

    return false;
}

/**
 * load a image
 * @param url       String  image url
 * @param options   Object
 * @returns Object(Image)
 */
function loadImage(url, options)
{
    var image = new Image;

    typeof (options) === 'object' ? null : options = {};
    var onerror = options.onerror ? options.onerror : null;
    var onload = options.onload ? options.onload : null;
    var onabort = options.onabort ? options.onabort : null;

    onerror ? image.onerror = onerror : null;
    onload ? image.onload = onload : null;
    onabort ? image.onabort = onabort : null;

    image.src = url;

    return image;
}

/* --- Image function group ---------------------------------------- */

/**
 * create image object  创建图片
 * @param String url
 * @param null|Array options  element attributes
 * @returns Object of Image
 */
function createImage(url, options)
{
    // create new
    var image = new Image();

    if (typeof (options) === "undefined") {
        options = new Array();
    }
    for (var i in options) {
        image[i] = options[i];
    }

    image.src = url;

    return image;
}

/**
 * set image centered fill
 * @param image Object(ImageHTMLElement)
 */
function setImageCenteredFill(image)
{
    // check if loaded
    if (image.complete !== true) {
        // call self again
        image.onload = (function ()
        {
            setImageCenteredFill(this);
        });
        return;
    }

    // reset max width & height rule
    image.style.maxHeight = "none";
    image.style.maxWidth = "none";
    image.style.width = "auto";
    image.style.height = "auto";

    image_width = image.offsetWidth;
    image_height = image.offsetHeight;

    // get parent
    var parent = image.parentNode;

    container_width = parent.offsetWidth;
    container_height = parent.offsetHeight;

    if (container_width / container_height < image_width / image_height) {
        image.style.height = '100%';
        image.style.width = 'auto';
        image.style.marginLeft = (container_width - image.offsetWidth) / 2 + 'px';
    }
    else {
        image.style.height = 'auto';
        image.style.width = '100%';
        image.style.marginTop = (container_height - image.offsetHeight) / 2 + 'px';
    }

}

/**
 * set a element random color border
 * @param  Object (HTMLElement)  element
 * @param  Object  options
 */
function setRandomBorder(element, options)
{
    typeof (options) === 'object' ? null : options = {};
    var width = options.width || 1;
    var lightness = options.lightness || 255;
    var saturation = options.saturation || 255;

    var thirdPrimaryColor = ['r', 'g', 'b'];
    var randomColor = {
        r : 0,
        g : 0,
        b : 0
    };
    var randomIndex = getRandomInteger(3);
    randomColor[thirdPrimaryColor[randomIndex]] = lightness;

    switch (randomIndex) {
        case 0 :
            var twoColor = ['g', 'b'];
            break;
        case 1 :
            var twoColor = ['r', 'b'];
            break;
        case 2 :
            var twoColor = ['r', 'g'];
            break;
    }

    var randomSecondIndex = getRandomInteger(2);
    randomColor[twoColor[randomSecondIndex]] = getRandomInteger(saturation + 1);

    $(element).css({
        'border-style' : 'solid',
        'border-width' : width + 'px',
        'border-color' : replaceData('rgb(R,G,B)', {
            R : randomColor.r,
            G : randomColor.g,
            B : randomColor.b
        })
    });

}

/* --- Multimedia function group ------------------------------------------------ */

/**
 * check audio supported  检查音频支持
 * @param coding String  coding name
 * @return Bool  true if supported or false if not supported
 */
function checkAudio(coding)
{
    var audio = createAudio();
    if (audio === false) {
        return false;
    }
    if (audio.canPlayType("audio/" + coding)) {
        return true;
    }
    return false;
}

/**
 * create a audio player
 * @return  Object
 * -- Object(AudioHTMLElement)  el
 * -- Function  init
 * -- Function  setController   set a new audio element
 * -- Function  setAudio        set a new audio file url
 * -- Function  play            play audio
 * -- Function  pause           pause audio
 * -- Function  getStatus       get playing status
 * -- Function  toggle          toggle playing status
 * -- Function  getCurrentTime  get current time (second)
 * -- Function  setCurrentTime  set a new current time (second)
 */
function createAudioPlayer()
{
    var audioPlayer = {
        el : createElement('audio', {
            autoplay : true,
            preload : true,
            muted : false
        }),
        networkStateMap : {
            0 : '音频/视频尚未初始化',                           // NETWORK_EMPTY
            1 : '音频/视频是活动的且已选取资源，但并未使用网络',  // NETWORK_IDLE
            2 : '浏览器正在下载数据',                            // NETWORK_LOADING
            3 : '未找到音频/视频来源'                            // NETWORK_NO_SOURCE
        },
        init : function (options){

            var me = this;
            var loadedmetadata  = options.loadedmetadata || null;
            var timeupdate      = options.timeupdate || null;
            var ended           = options.ended || null;
            var error           = options.error || null;
            var canplaythrough  = options.canplaythrough || null;
            if (loadedmetadata)
            {
                $(this.el).on("loadedmetadata", loadedmetadata);
            }
            if (timeupdate)
            {
                $(this.el).on("timeupdate", timeupdate);
            }
            if (ended)
            {
                $(this.el).on("ended", ended);
            }
            if (canplaythrough)
            {
                $(this.el).on("canplaythrough", canplaythrough);
            }
            else {
                if (this.el.autoplay)
                {
                    $(this.el).on("canplaythrough", function (){
                        me.play();
                    });
                }
            }
            if (error)
            {
                $(this.el).on("error", error);
            }
            else
            {
                $(this.el).on("error", function(errorEvent){
                    addConsoleLog('An error occurred: ');
                    addConsoleLog('  current source url: ' + this.currentSrc);
                    addConsoleLog('  current time: ' + this.currentTime);
                    var networkStatus = this.networkState;
                    if (typeof(me.networkStateMap[networkStatus]) != 'undefined')
                    {
                        addConsoleLog('  network status: ' + me.networkStateMap[networkStatus]);
                    }
                });
            }
        },
        /**
         * set a new controller
         * @param  Object(AudioHTMLElement)  audioElement
         */
        setController : function (audioElement){
            this.el = audioElement;
        },
        /**
         * set audio file
         * @param  String  url
         */
        setAudio : function (url){
            this.pause();
            this.el.src = url;
            this.play();
        },
        /**
         * play audio
         * @return  {boolean}
         */
        play : function (){

            if (!this.el.paused)
            {
                return true;
            }

            // try to play
            try
            {
                this.el.play();
            }
            catch (e)
            {
                // play fail
                return false;
            }

            // check play status, some browser not allow auto play.
            if (this.el.paused) {
                // play fail
                return false;
            }

            return true;
        },

        /**
         * pause audio
         * @return  {boolean}
         */
        pause : function()
        {
            if (this.paused)
            {
                return true;
            }

            // try to pause
            this.el.pause();

            // check play status
            if (!this.el.paused) {
                // still playing, pause fail
                return false;
            }

            return true;
        },

        /**
         * get music play status
         * @return  boolean
         */
        getStatus : function()
        {
            // return status
            return !this.el.paused;
        },

        /**
         * toggle play status
         * @return  boolean
         */
        toggle : function()
        {
            // check status
            if (this.getStatus()) {
                // playing then pause
                return this.pause();
            }
            else {
                // pausing then play
                return this.play();
            }
        },

        getCurrentTime : function (){
            return this.el.currentTime;
        },
        setCurrentTime : function (second) {
            this.el.currentTime = second;
        }
    };  // end audioPlayer object define

    return audioPlayer;
}

/**
 * check if current browser supports full screen
 * @param name  String  element name, default is video.
 * @return boolean
 */
function supportsFullScreen(name)
{
    name ? null : name = 'video';

    var element = createElement(name);

    return element.requestFullscreen |
        element.webkitRequestFullscreen |
        element.mozRequestFullScreen |
        element.msRequestFullscreen |
        element.oRequestFullscreen;
}

/**
 * set a video element full screen
 * @param videoElement  HTMLElement
 * @returns boolean
 */
function setFullScreenVideo(videoElement)
{
    try
    {
        if(videoElement.requestFullscreen)
        {
            videoElement.requestFullscreen();
            return true;
        }
        else if(videoElement.mozRequestFullScreen)
        {
            videoElement.mozRequestFullScreen();
            return true;
        }
        else if(videoElement.msRequestFullscreen)
        {
            videoElement.msRequestFullscreen();
            return true;
        }
        else if(videoElement.oRequestFullscreen)
        {
            videoElement.oRequestFullscreen();
            return true;
        }
        else if(videoElement.webkitRequestFullscreen)
        {
            videoElement.webkitRequestFullScreen();
            return true;
        }
    }
    catch (e)
    {
        addConsoleLog(e);
    }

    return false;
}

/**
 * set auto check video to play
 * @param  String|HTMLElement  element
 * @return boolean
 */
function setAutoCheckVideoToPlay(element)
{
    if ( typeof(element) === 'string' )
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

    if (element.tagName.toLowerCase() !== 'video')
    {
        addErrorLog('element param is not a video element.');
        return false;
    }

    setInterval(function()
    {
        if (element.paused)
        {
            element.play();
        }

    }, 1000);

    return true;
}

/**
 * set some element take turns to show
 * @param  String|Array  elementList
 * @param  Object        options
 *   interval : turn interval (second), default 10
 *   number : show count one time, default one
 * @return number  timer quote
 */
function setTakeTurns(elementList, options)
{
    var interval = options.interval || 10;
    var number = options.number || 1;

    if (getDebugStatus() && existDebuggingContent('setTakeTurns'))
    {
        addDebugLog('interval=' + interval);
        addDebugLog('number=' + number);
    }

    var timer = setInterval(function()
    {
        var list = typeof(elementList) === 'string' ?
            $(elementList) : elementList;

        // get hidden item count
        var count = list.length;
        var hideCount = list.filter(':hidden').length;

        hideCount += number;
        if (hideCount >= count)
        {
            hideCount = 0;
        }

        if (getDebugStatus() && existDebuggingContent('setTakeTurns'))
        {
            addDebugLog('interval=' + interval);
            addDebugLog('number=' + number);
            addDebugLog('count=' + count);
            addDebugLog('hideCount=' + hideCount);
        }

        // hide some element
        list.show().filter(':lt(' + hideCount + ')').hide();

    }, interval * 1000);

    return timer;
}

/**
 * set take turn to display some image
 * @param wrapper  HTMLElement|String  element object or CSS path string
 * @param interval  Number
 * @return
 */
function setTakeTurnDisplayImage(wrapper, interval)
{
    wrapper = $(wrapper);

    interval ? null : interval = 5;

    // find image items
    var imageItems = wrapper.find('.imageItem');
    if (imageItems.length < 1)
    {
        return;
    }

    // remove hidden class, and display first item.
    imageItems.removeClass('hidden').hide().eq(0).show();

    // create a timer
    setInterval(function(){
        var imageItems = wrapper.find('.imageItem');
        var visibleItems = imageItems.filter(':visible');
        var currentIndex = imageItems.index(visibleItems);
        currentIndex++;
        if (currentIndex >= imageItems.length)
        {
            currentIndex = 0;
        }

        // hide and after display next image
        visibleItems.fadeOut('fast', function(){
            imageItems.eq(currentIndex).fadeIn();
        });

    }, interval * 1000);
}

/**
 * set video play list
 * @param element   HTMLElement|String  element object or id
 * @param list      Array               array of video url string
 */
function setVideoPlaylist(element, list)
{
    if (typeof (element) === "string")
    {
        element = getElement(element);
        if (!element) { return; }
    }

    try
    {
        if (list.length === 0)
        {
            // stop and remove file
            element.pause();
            element.src = '';
        }

        // play first video
        element.pause();
        element.src = list[0];
        $(element).data('currentIndex', 0);
        element.load();
        element.play();

        // auto load next video when play end
        element.onended = (function()
        {
            var fileSrc = this.src;
            var index = $(element).data('currentIndex') || '0';
            index = parseInt(index);
            index++;

            if (index >= list.length)
            {
                index = 0;
            }

            this.pause();
            this.src = list[index];
            $(element).data('currentIndex', index);
            this.load();
            this.play();
        });
    }
    catch(e)
    {
        addConsoleLog(e);
    }

}



/**
 * check canvas supported  检查画布元素支持
 * @returns boolean
 */
function canvasSupport()
{
    return typeof (createElement('canvas').getContext) === 'function';
}

/* --- URL function group ------------------------------------------ */

/**
 * add url param  添加网址参数
 * @param url String  网址
 * @param name String  param name  参数名
 * @param value String  param alue  参数的值
 */
function addUrlParam(url, name, value)
{
    var new_url = url;
    if (url.indexOf("?") < 0) {
        new_url += "?";
    }
    else {
        new_url += "&";
    }
    new_url += name + "=" + value;
    return new_url;
}

/**
 * get url param  获取网址参数
 * @param name String  param name  参数名
 * @returns fixed  param value  参数的值
 */
function getUrlParam(name)
{

    var default_value = arguments[1] ? arguments[1] : null;

    // get query string
    var query_string = location.search.replace('?', '');

    // no any param
    if (!query_string.length) {
        return default_value;
    }

    // 以 & 分割字符串(a=1&b=2) to ['a=1', 'b=2']
    var url_query_params = query_string.split("&");

    var index_name = -1;
    for (var i = 0; i < url_query_params.length; i++) {

        index_name = url_query_params[i].indexOf(name + "=");

        // 参数名开头
        if (index_name === 0) {
            return url_query_params[i].substring(index_name + 1 + name.length);
        }
    }

    return default_value;
}

/**
 * @param   Array   paramsList
 */
function getParamsFromUrl(paramsList)
{
    var params = {};
    for (var i=0; i<paramsList.length; i++)
    {
        var tName = paramsList[i];
        var tValue = getUrlParam(paramsList[i]) || '';
        tValue ? params[tName] = decodeURIComponent(tValue) : null;
    }
    return params;
}

/* --- Window function group ------------------------------------------- */

/**
 * go to top of window
 * if has jQuery, then use animate method for transition effect.
 */
function goToTop() {

    if (typeof(jQuery) !== 'undefined')
    {
        var scrollTop = getScrollTop();
        var speed = 'normal';
        if (scrollTop < 100)
        {
            speed = 'slow';
        }
        else if (scrollTop >= 1000)
        {
            speed = 'fast';
        }
        $("html, body").animate({
            scrollTop: 0
        }, speed);
    }
    else
    {
        document.body.scrollTop = 0;    // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
}

/**
 * Get scroll top  获取窗口视图区域到顶部的滚动距离
 * @returns Number|false
 */
function getScrollTop()
{
    if (document.documentElement && document.documentElement.scrollTop)     // For standard
    {
        return document.documentElement.scrollTop;
    }
    else if (document.body)     // For Internet Explorer old version
    {
        return document.body.scrollTop;
    }
    return false;
}

/**
 * Get scroll height  获取窗口视图区域的高度
 * @returns Number
 */
function getScrollHeight()
{
    if (document.documentElement && document.documentElement.scrollHeight)      // For standard
    {
        return document.documentElement.scrollHeight;
    }
    else if (document.body)     // For Internet Explorer
    {
        return document.body.scrollHeight;
    }
    return false;
}

/**
 * init load more action
 * @param  Object  options
 * - Number  bottomDistance  distance of approach bottom, default 40.
 * - Object|String  element  element node or CSS selector string
 * @param  Function  callback
 */
function initLoadMore(options, callback)
{
    options ? null : options = {};
    var bottomDistance = options.bottomDistance || 40;
    var element = options.element || window;

    $(element).on("scroll", function ()
    {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();

        if (scrollTop + windowHeight >= scrollHeight - bottomDistance) {
            callback();
        }
    });
}

/**
 * page down wrapper
 * @param   HTMLElement|String  element     element object or css selector
 */
function pageDown(element)
{
    if (typeof(element) === "string") {
        var elementQueryList = $(element);
        if (!elementQueryList.length) {
            return;
        }

        element = elementQueryList[0];
    }

    if ( getDebugStatus() && existDebuggingContent('pageDown') )
    {
        addDebugLog('scroll height: ' + element.scrollHeight);
        addDebugLog('offset height: ' + element.offsetHeight);
    }

    // check if overflow
    if (element.scrollHeight > element.offsetHeight) {

        // check scroll top
        if (element.scrollTop < element.scrollHeight - element.offsetHeight) {
            element.scrollTop += element.offsetHeight;
        }
        else {
            element.scrollTop = 0;
        }
    }
}

/**
 * set a wrapper auto page down
 * @param   HTMLElement|String  element     element object or css selector
 * @param   Number              interval    interval time (second)
 */
function setAutoPageDown(element, interval)
{
    if (!interval) {
        interval = 10;
    }

    window.setInterval(function ()
    {
        pageDown(element);
    }, interval * 1000)
}

/**
 * set a use marquee effect
 * @param element  Object(HTMLElement)|String   element node quote or CSS selector string
 * @param speed
 * @return boolean|number  'false' if fail, or interval quote if success.
 */
function setMarquee(element, speed)
{
    if (typeof(element) === "string") {
        var elementQueryList = $(element);
        if (!elementQueryList.length) {
            return;
        }

        element = elementQueryList[0];
    }

    if (!interval) {
        interval = 10;
    }

    var childList = element.find();

    var timer = window.setInterval(function ()
    {
        var step = speed / 1000;

        if ( getDebugStatus() && existDebuggingContent('setMarquee') )
        {
            addDebugLog('scroll height: ' + element.scrollLeft);
            addDebugLog('offset height: ' + element.offsetWidth);
            addDebugLog('scroll top: ' + element.scrollTop);
        }

        // check if overflow
        if (element.scrollHeight > element.offsetHeight)
        {
            // check scroll top
            if (element.scrollTop < element.scrollHeight - element.offsetHeight) {
                element.scrollTop += element.offsetHeight;
            }
            else {
                element.scrollTop = 0;
            }
        }
    }, 1);

    return timer;
}

/**
 * get window height  获取窗口的高度
 * @returns Number
 */
function getWindowHeight()
{
    if (typeof($) !== 'undefined')
    {
        return $(window).outerHeight();
    }

    // standard API: window.innerHeight
    // wrong API: $(window).height() when body height < window height, value = body height
    var height = window.innerHeight
        || window.height;               // IE old version

    return height ? height : 0;
}

/**
 * get window width  获取窗口的宽度
 * @returns Number
 */
function getWindowWidth()
{
    if (typeof($) !== 'undefined')
    {
        return $(window).outerWidth();
    }

    // standard API: window.innerWidth
    // wrong API: $(window).width()
    var width = window.innerWidth
        || window.width;            // IE old version

    return width ? width : 0;
}

/**
 * get body element height
 * @returns Number
 */
function getBodyHeight()
{
    // standard API: document.body.offsetHeight, document.documentElement.offsetHeight
    var bodyHeight = document.body.offsetHeight ||
        document.documentElement.offsetHeight ||
        document.body.clientHeight ||               // IE old version
        $(document.body).height();                   // jQuery API

    return bodyHeight ? bodyHeight : 0;
}

/**
 * set body min height
 * @returns boolean
 */
function setBodyMinHeight()
{
    // set window resize event
    $(window).on('resize', function ()
    {
        // reset height to auto
        $(document.body).css('height', 'auto');

        var bodyHeight = getBodyHeight();
        var windowHeight = getWindowHeight();

        if ( getDebugStatus() && existDebuggingContent('setBodyMinHeight') )
        {
            addDebugLog('bodyHeight= ' + bodyHeight);
            addDebugLog('windowHeight= ' + windowHeight);
        }

        // can not get height
        if (bodyHeight === 0 || windowHeight === 0) {
            return false;
        }

        if (bodyHeight < windowHeight) {
            $(document.body).css('height', windowHeight + 'px');
        }

    }).trigger('resize');
}

/**
 * check a wrapper if is overflow height
 * @param  String|HTMLObject  selector  CSS selector string of wrapper or HTML object
 * @return boolean
 */
function isOverflowHeight(selector)
{
    var wrapperList = $(selector);
    if (!wrapperList.length) {
        return false;
    }

    var wrapper = wrapperList[0];

    var childrenList = wrapper.children;
    var contentHeightCount = 0;
    for (var i = 0; i < childrenList.length; i++) {
        contentHeightCount += parseInt($(childrenList[i]).css('margin-top').replace('px', ''));
        contentHeightCount += childrenList[i].offsetHeight;
        contentHeightCount += parseInt($(childrenList[i]).css('margin-bottom').replace('px', ''));
    }

    if (contentHeightCount > wrapper.offsetHeight) {
        return true
    }
    else {
        return false;
    }
}

/* mask method */

/**
 * show mask
 * the mask layer is fixed position, 100% size in window, and 70% black background color.
 * @requires  common_component.css  jQuery
 */
function showMask()
{
    var mask = getElement('pageMask');
    if (!mask)
    {
        mask = createElement('div', {
            id : 'pageMask',
            'class' : "maskLayer layer"
        });
        document.body.append(mask);
    }

    $(mask).show();
}

/**
 * hidden mask layer
 */
function hideMask()
{
    $('#pageMask').hide();
}

/* dialog method */

function createDialog(options)
{

}

/**
 * adjust dialog width & height
 * @param dialog  HTMLElement
 */
function adjustDialog(dialog)
{
    // get window height
    var windowHeight = getWindowWidth();

    // get dialog height
    var dialogHeight = $(dialog).outerHeight();

    var dialogHeaderHeight = $(dialog).find('.dialog_header').outerHeight();
    var dialogFooterHeight = $(dialog).find('.dialog_footer').outerHeight();

    var dialogBodyHeight = dialogHeight - dialogHeaderHeight - dialogFooterHeight;
    $(dialog).find('.dialog_body').css("height", dialogBodyHeight + 'px');
}

/**
 * center dialog in current window
 * @param dialog  HTMLElement
 */
function centerDialog(dialog)
{
    // reset margin
    $(dialog).css({
        'margin'    : '0',
        'left'      : '0',
        'top'       : '0'
    });

    var windowWidth     = getWindowWidth();
    var windowHeight    = getWindowHeight();

    var dialogWidth     = $(dialog).outerWidth();
    var dialogHeight    = $(dialog).outerHeight();

    var leftOffset      = (windowWidth - dialogWidth) / 2;
    var topOffset       = (windowHeight - dialogHeight) / 2;

    $(dialog).css({
        'margin-left' : '0',
        'margin-top'  : '0',
        'left'        : leftOffset + 'px',
        'top'         : topOffset + 'px'
    });
}

/**
 * initialize dialog action
 */
function initDialogAction()
{
    // close button for layer panel
    $('.layer .panel .close_button').on('click', function ()
    {
        var layer = $(this).parents('.layer');
        layer.fadeOut();
    });

    $('.dialog .close_button').on('click', function ()
    {
        var dialog = $(this).parents('.dialog');
        var layer = $(this).parents('.layer');

        if (layer.length)
        {
            layer.fadeOut();
        }
        else
        {
            dialog.fadeOut();
        }
    });
}

/**
 * open dialog
 * @param String|Object(HTMLElement)  css_selector  CSS selector string for dialog
 * @param Object  options
 * - Function onConfirm(Object dialog)  trigger when click confirm button
 * - Function onCancel(Object dialog)  trigger when click cancel button
 * - Function onShow(Object dialog)  trigger when dialog show
 */
function openDialog(css_selector, options)
{
    typeof (options) == 'object' ? null : options = {};

    var onConfirm   = options.onConfirm || function(){};
    var onCancel    = options.onCancel || function(){};
    var onShow      = options.onShow || function(){};

    var jDialog = $(css_selector);

    var jFormEle    = jDialog.find('.dialog_body form');
    var form        = jFormEle.length ? jFormEle[0] : null;

    jDialog.find('.confirmButton').on('click', function(){
        onConfirm(jDialog[0], form);
    });
    jDialog.find('.cancelButton').on('click', function(){
        onCancel(jDialog[0]);
    });

    $(css_selector).fadeIn(function(){
        onShow(jDialog[0]);
    });

    adjustDialog(jDialog[0]);
    centerDialog(jDialog[0]);
}

/**
 * close dialog
 * @param String|Object(HTMLElement)  css_selector  CSS selector string for dialog
 */
function closeDialog(css_selector)
{
    $(css_selector).fadeOut();
}

/**
 * show a message box
 * @param message  String  message text
 * @param title    String  message box title
 * @return boolean
 */
function showMessageBox(message, title)
{
    title ? null : title = '提示';

    var messageBox = $('#mainMessageBox');
    if (!messageBox)
    {
        addConsoleLog('Element #mainMessageBox not exist.');
        return false;
    }

    messageBox.find('.dialog_body').html('<p>' + message + '</p>');

    messageBox.find('.dialog_header .dialog_title').html(title);

    messageBox.fadeIn();

    centerDialog(messageBox);

    //var width = messageBox.width();
    //var marginLeft = width / 2 * -1;
    //messageBox.css('margin-left', marginLeft + 'px');

    return true;
}

/* --- Browser function group ------------------------------------------ */

/**
 * Get browser core  获取浏览器核心
 * @returns String  core name
 */
function getBrowserCore()
{
    // Find known core names from the userAgent data  搜索核心名称
    var userAgent = window.navigator.userAgent;
    var isGecko = RegExp("Gecko").test(userAgent);
    var isWebkit = RegExp("AppleWebKit").test(userAgent);
    var isPresto = RegExp("Presto").test(userAgent);
    var isTrident = RegExp("IE").test(userAgent);

    // Return result  返回结果
    if (isWebkit) {
        return "Webkit";
    }
    if (isGecko) {
        return "Gecko";
    }
    if (isPresto) {
        return "Presto";
    }
    if (isTrident) {
        return "Trident";
    }

    // Return "unknown" as unknown core  不是主流浏览器
    return "unknown";
}

/**
 * check if is IE
 * @returns boolean
 */
function isIE()
{
    return getBrowserCore() == "Trident";
}

/**
 * Get IE browser core  获取 IE 的版本
 * @returns Number
 */
function getIEsVersion()
{
    // Check whether the current browser is IE  检查是否 IE 浏览器
    var userAgent = window.navigator.userAgent;
    var isIE = userAgent.search(RegExp("MSIE [0-9.]+;"));
    if (!isIE) {
        return 0;
    }

    // Get the browser version  获取版本
    var version = userAgent.match(RegExp("MSIE [0-9]+.[0-9]+;"))[0];
    version = version.replace(RegExp("MSIE ([0-9])+.[0-9]+;"), "$1");
    return Number(version);
}

/**
 * check if current browser is weixin
 * @returns Boolean
 */
function isWeixin()
{
    return navigator.userAgent.indexOf('MicroMessenger') >= 0
}
var isWechat = isWeixin;

/**
 * check if current browser is windows wechat
 * @returns Boolean
 */
function isWindowsWechat()
{
    return navigator.userAgent.toLocaleLowerCase().indexOf('windowswechat') >= 0;
}

/**
 * get browser language, return lower case text like "zh-cn".
 * @return String
 */
function getBrowserLanguage()
{
    // web standard use navigator.language API, value is no case
    // and IE6-8 use navigator.browserLanguage API, value is lower case.
    var lang = '';
    try {
        lang = (navigator.language || navigator.browserLanguage).toLowerCase();
    }
    catch (e) {
        addConsoleLog(e);
        return lang;
    }

    return lang;
}

/**
 * check browser
 * @return Object
 * - cssVersion  String  CSS version
 * - storageSupported  Boolean
 * - jsonSupported  Boolean
 * - fileReaderSupported  Boolean
 * - evaluate  String  good|normal|bad
 */
function checkBrowserFunction()
{
    var result = {
        cssVersion : '0',
        storageSupported : typeof (localStorage) != 'undefined',
        jsonSupported : typeof (JSON) != 'undefined',
        fileReaderSupported : typeof (FileReader) != 'undefined',
        evaluate : ''
    };

    if ( typeof(document.body.style) == 'undefined')
    {
        result.cssVersion = '0';
    }
    else if ( typeof(document.body.style.display) == 'undefined')
    {
        result.cssVersion = '1';
    }
    else if ( typeof(document.body.style.borderRadius) != 'undefined')
    {
        result.cssVersion = '3';
    }
    else if ( typeof(document.body.style.fontSize) != 'undefined')
    {
        //
        result.cssVersion = '2.1';
    }
    else if ( typeof(document.body.style.backgroundImage) != 'undefined')
    {
        result.cssVersion = '2';
    }

    var score = 0;

    result.storageSupported ? score++ : null;
    result.jsonSupported ? score++ : null;
    result.fileReaderSupported ? score++ : null;

    if (score>=3)
    {
        result.evaluate = 'good';
    }
    else if (result.cssVersion >= '3')
    {
        result.evaluate = 'normal';
    }
    else
    {
        result.evaluate = 'bad';
    }

    return result;
}

/* --- file function group ----------------------------------------- */

/**
 * check file type
 * @param file object(File)
 * @param type string
 * @returns boolean
 */
function checkFile(file, type)
{
    return file.type.indexOf(type) === 0;
}

/**
 * check file is image type
 * @param file  Object(File)
 * @returns boolean
 */
function checkFileIsImage(file)
{
    if (/image\/\w+/.test(file.type)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * check file reader supported  检查文件读取器支持
 * @returns boolean
 */
function fileReaderSupport()
{
    return typeof(FileReader) !== 'undefined';
}

/**
 * read a file
 * @param file  Object(File)
 * @param data_type  String
 * 'data_url', 'array_buffer', 'binary_string', 'text'
 * @param options  Object|null
 * 'onabort', 'onload', 'onloadend', 'onloadstart', 'onprogress'
 */
function readFile(file, data_type, options)
{
    if (!fileReaderSupport()) {
        addConsoleLog('[error] FileReader API is not supported.');
        return false;
    }

    typeof (options) === 'object' ?
        null : options = {};

    var onabort = options.onabort ? options.onabort : null;
    var onload = options.onload ? options.onload : null;
    var onloadend = options.onloadend ? options.onloadend : null;
    var onloadstart = options.onloadstart ? options.onloadstart : null;
    var onprogress = options.onprogress ? options.onprogress : null;

    // 创建文件读取器
    var reader = new FileReader();

    onabort ? reader.onabort = onabort : null;
    onload ? reader.onload = onload : null;
    onloadend ? reader.onloadend = onloadend : null;
    onloadstart ? reader.onloadstart = onloadstart : null;
    onprogress ? reader.onprogress = onprogress : null;

    switch (data_type) {
        case 'data_url' :
            reader.readAsDataURL(file);
            return true;
            break;
    }

    return false;
}

/**
 * convert image to canvas object
 * @param image     Image|String    image object or image url string
 * @param options   Object          image data options
 * @param callback  Function|null   convert success callback function
 * @returns Object(CanvasHTMLElement)|false
 */
function convertImage2Canvas(image, options, callback)
{
    // check canvas support
    if (!canvasSupport()) {
        return false;
    }

    var image_object = null;

    typeof (options) === 'object' ? null : options = {};

    var image_min_width = options.image_min_width ? options.image_min_width : -1;
    var image_min_height = options.image_min_height ? options.image_min_height : -1;
    var image_max_width = options.image_max_width ? options.image_max_width : -1;
    var image_max_height = options.image_max_height ? options.image_max_height : -1;

    if ( getDebugStatus() && existDebuggingContent('convertImage2Canvas') )
    {
        addDebugLog('image_max_width: ' + image_max_width);
        addDebugLog('image_max_height: ' + image_max_height);
    }

    // canvas size
    var canvas_width = options.canvas_width ? options.canvas_width : -1;
    var canvas_height = options.canvas_height ? options.canvas_height : -1;

    // error event
    var onerror = options.onerror ? options.onerror : null;

    if (typeof(image) === 'string') {
        image_object = new Image;
        image_object.src = image;
    }
    else {
        image_object = image;
    }

    onerror ? image_object.onerror = onerror : null;

    image_object.onload = (function ()
    {

        // 宽高比例
        var image_ratio = this.width / this.height;

        // limit size
        if (
            image_min_width > -1 ||
            image_min_height > -1 ||
            image_max_width > -1 ||
            image_max_height > -1
        ) {
            // min size limit
            if (this.width < image_min_width || this.height < image_min_height) {
                // 取最小宽度时，高度不小于最小高度
                if (image_min_width / image_ratio >= image_min_height) {
                    // 宽度取最小值，高度按比例
                    this.width = image_min_width;
                    this.height = this.width / image_ratio;
                }
                else {
                    // 高度取最小值，宽度按比例
                    this.height = image_min_height;
                    this.width = this.height * image_ratio;
                }
            }

            // max size limit
            if (image_max_width > -1 && this.width > image_max_width && image_max_height > -1 && this.height > image_max_height) {
                // 宽度和高度都超过了
                if (image_max_width / image_ratio <= image_max_height)  // 取最大宽度时，高度不超过最大高度
                {
                    // 宽度取最大值，高度按比例
                    this.width = image_max_width;
                    this.height = this.width / image_ratio;
                }
                else {
                    // 高度取最大值，宽度按比例
                    this.height = image_max_height;
                    this.width = this.height * image_ratio;
                }
            }
            else if (image_max_width > -1 && this.width > image_max_width) {
                // 只是宽度超过了
                this.width = image_max_width;
                this.height = this.width / image_ratio;
            }
            else if (image_max_height > -1 && this.height > image_max_height) {
                // 只是高度超过了
                this.height = image_max_height;
                this.width = this.height * image_ratio;
            }
        }

        // create canvas element
        var canvas = createElement('canvas');
        //canvas.style.display = 'block';
        var ctx = canvas.getContext("2d");

        // set canvas size
        canvas.width = canvas_width > -1 ? canvas_width : this.width;
        canvas.height = canvas_height > -1 ? canvas_height : this.height;

        // 画图后，重设画布尺寸裁剪
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

        // success callback
        if (callback) {
            callback(canvas);
        }

    });
    /* end image onload event */
}

/* --- Form function group ----------------------------------------------- */

/**
 * get form by element
 * @param element   Object(HTMLElement)
 * @returns Object(HTMLElement)|null
 */
function getForm(element)
{
    return element.form ? element.form : null;
}

/**
 * set form control
 * @param form  Object(HTMLElement)|String  form dom quote or ID
 * @param name  String                      form control's name property
 * @param value                             form control's new value
 * @return boolean
 */
function setFormControl(form, name, value)
{
    // get element by ID
    if (typeof (form) === 'string') {
        var formId = form;
        form = document.getElementById(form);
        if (!form) {
            addErrorLog('form dom with id:' + formId + ' not found.');
            return false;
        }
    }

    // get form controls
    var controls = $(form).find('*[name="' + name + '"]');

    for (var controlIndex = 0; controlIndex < controls.length; controlIndex++)
    {
        var controlItem = controls[controlIndex];

        // check element name
        switch (controlItem.nodeName.toLowerCase())
        {
            case 'input' :
                switch(controlItem.type)
                {
                    case 'checkbox':
                        inArray(controlItem.value, value) ? controlItem.checked = true : null;
                        break;
                    case 'radio' :
                        controlItem.value == value ? controlItem.checked = true : null;
                        break;
                    case 'password' :
                        if ( getDebugStatus() && existDebuggingContent('setFormControl') )
                        {
                            addDebugLog('skip inputbox type:password.');
                        }
                        break;
                    case 'file' :
                        if ( getDebugStatus() && existDebuggingContent('setFormControl') )
                        {
                            addDebugLog('skip inputbox type:file.');
                        }
                        break;
                    case 'text' :
                    default :   // other like email, number, url ...
                        controlItem.value = value;
                }
                break;
            case 'textarea' :
                controls[controlIndex].innerHTML = value;
                break;
            case 'select' :
            default :   // extension for the future
                controlItem.value = value;
        }
    }

    return true;
}

/**
 * check form is validate
 * @param   form    Object(HTMLFormElement) | String    form element or id
 * @returns boolean
 */
function checkForm(form)
{
    // get element by ID
    if (typeof (form) === 'string') {
        var formId = form;
        form = document.getElementById(form);
        if (!form) {
            addErrorLog('form dom with id:' + formId + ' not found.');
            return false;
        }
    }

    for (var i=0; i<form.length; i++)
    {
        var required = form[i].required || false;
        var value = form[i].value;

        if (required && value === "")
        {
            form[i].focus();
            return false;
        }
    }

    return form.checkValidity();
}

/**
 * submit form use ajax
 * @param HTMLElement form     form element
 * @param Object      options  ajax request options, base on jQuery.ajax function's options
 * @return boolean
 */
function formAjaxSubmit(form, options)
{
    options ? null : options = {};

    if (typeof(options.url) === 'undefined')
    {
        options.url = form.dataset.api || '';
        if (!options.url)
        {
            addConsoleLog('[error] missing url param for ajax submit form.');
            return false;
        }
    }
    if (typeof(options.type) === 'undefined')
    {
        options.type = form.method || 'post';
    }

    options.data = $(form).serialize();

    $.ajax(options);

    return true;
}

/**
 * set check all action
 * @param   checkbox    Object(HTMLInputElement)
 */
function setCheckAllAction(checkbox)
{
    checkbox.onchange = (function ()
    {
        // get check status
        var check_status = this.checked;

        // get form's input controls
        var form_input_list = this.form.getElementsByTagName('input');

        // traversal
        for (var i = 0; i < form_input_list.length; i++) {
            if (form_input_list[i].type === 'checkbox') {
                form_input_list[i].checked = check_status;
            }
        }
    });
}

/**
 * set checkbox a action to check all children
 * @param checkbox  HTMLElement  checkbox input
 */
function setCheckAllChildrenAction(checkbox)
{
    $(checkbox).on('change', function()
    {
        // get status
        var status = this.checked;

        // get parent node, it maybe is label element
        var parent = this.parentNode;
        if (parent.nodeName.toLowerCase() === "label")
        {
            parent = parent.parentNode;
        }

        // get children list and checkboxes
        var childrenList = $(parent).find('ul');
        var childrenCheckboxes = childrenList.find('input[type="checkbox"]');

        // update checkboxes's status
        for (var i=0; i<childrenCheckboxes.length; i++)
        {
            childrenCheckboxes[i].checked = status;
        }

    });
}

/**
 * set a textarea element auto increase height
 * @param  object(HTMLElement)  textarea
 */
function setTextareaAutoIncreaseHeight(textarea)
{
    $(textarea).on("input", function(){
        if (this.offsetHeight < this.scrollHeight)
        {
            this.style.height = this.scrollHeight + "px";
        }
    });
}

/**
 * upload file
 * @param   Object  options
 * - data   Object  extra form data
 * - files  Array   file object list
 */
function uploadFiles(options)
{
    typeof (options) === 'object' ? null : options = {};

    options.type    = options.method || options.type || 'POST';
    options.dataType    = options.dataType || 'json';
    options.contentType = options.contentType || false;
    options.processData = options.processData || false;
    var name        = options.name || 'file';
    var data        = options.data || {};
    var files       = options.files || [];
    var onProgress  = options.onProgress || null;

    var me = this;

    // build form data
    var formData = new FormData();
    for (var i=0; i<files.length; i++)
    {
        formData.append(name || 'file', files[i]);
    }
    for (var key in data)
    {
        formData.append(key, data[key]);
    }

    options.data = formData;
    options.xhr = (function (){
        var xhr = $.ajaxSettings.xhr();
        if (xhr.upload && onProgress) {
            xhr.upload.addEventListener('progress', onProgress, false);
        }
        return xhr;
    });
    $.ajax(options);
}

/**
 * init importing file button
 * @param element   String|HTMLElement  css selector for element or element quoto
 * @param options   Object
 * @return      Object(ImportHelper)
 */
function initImportButton(element, options)
{
    var defaultOptions = {
        type : 'file'
    };

    typeof(options) === 'object' ? null : options = {};
    var name = options.name || '';

    var realOptions = mergeObject(defaultOptions, {
        name : name
    });

    var helper = {
        name : 'ImportHelper',
        control : createElement('input', realOptions)
    };

    $(helper.control).hide();
    document.body.appendChild(helper.control);

    $(helper.control).ajaxfileupload(options);

    $(element).on('click', function(){
        $(helper.control).trigger('click');
    });

    return helper;
}

/**
 * init file upload
 * init a file input element, can auto upload file when it changed.
 * @param  String|HTMLElement  element  file input element object or jquery selector
 * @param  Object  options
 * - success  Function  success callback
 * - error    Function  error callback
 * - complete Function  complete callback
 * - method   String    request method, default: POST
 * - url      String    request url
 * @required  jQuery
 */
function initFileUpload(element, options)
{
    typeof (options) === 'undefined' ? options = {} : null;

    var success = options.success || null;
    var error   = options.error || null;
    var complete = options.complete || null;
    var progress = options.progress || null;
    var method  = options.method || 'POST';
    var url     = options.url || '';
    var extraData   = options.extraData || {};

    $(element).on('change', function (){

        var me = this;

        // build form data
        var formData = new FormData();
        formData.append(this.name || 'file',this.files[0]);
        for (var key in extraData)
        {
            formData.append(key, extraData[key]);
        }

        $.ajax({
            url : url,
            type:'post',
            dataType : 'json',
            data: formData,
            contentType: false,
            processData: false,
            success : function (result, textStatus, jqXHR) {

                if (success)
                {
                    success(result, textStatus, jqXHR, me);
                }

            },
            error : error,
            complete : complete
        });
    });
}

/**
 * init file upload
 * init a file input element, can auto upload file when it changed.
 * @param   element     HTMLElement|String      file input object or jQuery selector
 * @param   options     Object                  for AjaxFileUpload plugin
 * -- url (required)    String
 * -- additionalData    Object
 * -- autoUpload        Boolean     default true
 * -- dataType          String      default "json"
 * -- method            String      default "post"
 * @require  AjaxFileUpload (https://github.com/jchild3rs/AjaxFileUpload)
 */
function initAdvancedFileUpload(element, options)
{
    $(element).ajaxFileUpload(options);
}

/**
 * initialize textbox actions
 * @param   textbox     Object(HTMLElement)     textbox element
 * @param   options     Object                  action option
 *   change : function(textbox, text, length)
 *   input  : function(textbox, text, length)
 *     param textbox   textbox element
 *     param text      textbox text
 *     param length    textbox text length
 */
function initTextboxActions(textbox, options)
{
    var change_callback = options.change ? options.change : null;
    var input_callback = options.input ? options.input : null;

    if (change_callback) {
        textbox.onchange = (function ()
        {

            var text = this.value;
            var length = text.length;

            change_callback(this, text, length);
        });
    }

    if (input_callback) {
        textbox.oninput = (function ()
        {

            var text = this.value;
            var length = text.length;

            input_callback(this, text, length);
        });
    }

}

/**
 * add a auto complete value to inputbox
 * this function simulate a form submit action
 * @param name        inputbox data name
 * @param value        inputbox value
 * @Author  Kevin
 * @date    2017-01-23
 */
function addInputboxAutocompleteValue(name, value)
{
    var form = document.createElement('form');
    form.action = 'javascript:;';
    form.method = 'post';
    form.style.display = 'none';

    var inputbox = document.createElement('input');
    inputbox.type = 'text';
    inputbox.name = name;
    inputbox.value = value;

    form.appendChild(inputbox);

    document.body.appendChild(form);

    form.submit();
    document.body.removeChild(form);
}

/**
 * check if current browser support cross origin
 * @returns boolean
 */
function isSupportCrossOrigin()
{
    if (typeof(XMLHttpRequest) == "undefined")
    {
        return false;
    }

    var xhr = new XMLHttpRequest();
    if (typeof(xhr.withCredentials) == "undefined")
    {
        return false;
    }
    else
    {
        return true;
    }
}

/* --- Dialog group ----------------------------------------------------------- */

/**
 * create a dialog  创建一个对话框
 * @param title  String  dialog title  对话框标题
 * @param text  String  dialog content text  对话框内容文本
 * argument 3  Object  dialog options  对话框参数
 * @return Object(DivHTMLElement)  对象（DOM）
 */
function createDialog(title, text)
{
    // get arguments
    var options = arguments[3] ? arguments[3] : new Object();

    // set dialog attributes
    var dialog_attributes = {
        "class" : "dialog"
    };
    if (options.id) {
        dialog_attributes.id = options.id;
    }

    // create new dialog
    var dialog = createElement("div", dialog_attributes);

    // dialog header
    var dialog_header = createElement("div", {
        "class" : "dialog_header"
    });
    dialog.appendChild(dialog_header);

    // dialog title
    var dialog_title = createElement("div", {
        "class" : "dialog_title"
    }, title);
    dialog_header.appendChild(dialog_title);

    // dialog buttons
    var dialog_buttons = createElement("div", {
        "class" : "dialog_buttons"
    });
    dialog_header.appendChild(dialog_buttons);
    var button_close = createElement("button", {
        "class" : "button_close dialog_close"
    }, "x");
    dialog_buttons.appendChild(button_close);
    button_close.onclick = (function ()
    {
        var dialog = this.parentNode.parentNode.parentNode;
        dialog.parentNode.removeChild(dialog);
    });

    // dialog body
    var dialog_body = createElement("div", {
        "class" : "dialog_body"
    }, text);
    dialog.appendChild(dialog_body);

    // return
    return dialog;
}

/**
 * remove dialog  移除对话框
 * @param dialog  String|Object(HTMLElement)  dialog ID or dialog node  对话框ID或对话框节点
 */
function removeDialog(dialog)
{
    if (!dialog || !dialog.parentNode) {
        return;
    }

    // get dialog node
    if (typeof(dialog) !== "object") {
        dialog = getElement(dialog);
    }

    // remove
    dialog.parentNode.removeChild(dialog);
}

/**
 * create a progress dialog  创建一个新的进度条对话框
 * @param id  String  dialog ID string  对话框ID
 * @param percent  Number  progress percent  进度条百分比
 */
function createProgressDialog(id, percent)
{
    // create a wrapper
    var dialog = createElement("div", {
        "id" : id,
        "class" : "dialog dialog_progress"
    });

    // create a wrapper to contain progress
    var box_progress = createElement("div", {
        "class" : "box_progress"
    });
    dialog.appendChild(box_progress);

    // create progress
    var progress = createElement("div", {
        "class" : "progress"
    });
    box_progress.appendChild(progress);

    // create progress percent display
    var progress_bar = createElement("div", {
        "class" : "progress-bar progress-bar-striped active"
    });
    progress.appendChild(progress_bar);

    // set width
    progress_bar.style.width = percent + "%";

    // display
    document.body.appendChild(dialog);
}

/**
 * update progress dialog  更新一个进度条对话框
 * @param id  String  dialog ID string  对话框ID
 * @param percent  Number  progress percent  进度条百分比
 * @returns boolean  true if success or false if fail  成功返回true，失败返回false
 */
function updateProgressDialog(id, percent)
{
    // get dialog node
    var dialog = getElement(id);
    if (!dialog) {
        log("dialog (" + id + ") not found.");
        return false;
    }

    var progress_bar = null;
    if (document.getElementsByClassName) {
        var list_progress_bar = dialog.getElementsByClassName("progress-bar");
        if (list_progress_bar.length) {
            progress_bar = list_progress_bar[0];
            progress_bar.style.width = percent + "%";
        }
    }
    else {
        $(dialog).find(".progress-bar").css("width", percent + "%");
    }

    return true;
}

/**
 * remove progress dialog  移除进度条对话框
 * @param id String  dialog ID string  对话框ID
 * @returns boolean  true if success or false if fail  成功返回true，失败返回false
 */
function removeProgressDialog(id)
{
    // get dialog node
    var dialog = getElement(id);
    if (!dialog) {
        log("dialog (" + id + ") not found.");
        return false;
    }

    // remove
    dialog.parentNode.removeChild(dialog);

    // return
    return true;
}

/**
 * show loadding icon
 * require jQuery library
 * @param speed  fade speed
 */
function showLoadingIcon(speed)
{
    $('#loading_icon_container').fadeIn(speed ? speed : 'fast');
}

/**
 * hide loadding icon
 * require jQuery library
 * @param speed  fade speed
 */
function hideLoadingIcon(speed)
{
    $('#loading_icon_container').fadeOut(speed ? speed : 'fast');
}

/* music controlling ---------------------------------------------- */

/**
 * get main audio controller
 * get the audio element with ID: mainAudioController
 * @returns Object(HTMLElement)|null
 */
function getMainAudioController()
{
    // get audio element
    return getElement('mainAudioController');
}

/**
 * play music
 * play audio use audio element with ID: mainAudioController
 * @return boolean
 */
function playMusic()
{
    // get audio element
    var mainAudioController = getElement('mainAudioController');
    if (!mainAudioController) {
        // audio controller not exist
        return false;
    }

    // try to play
    try
    {
        mainAudioController.play();
    }
    catch (e)
    {
        // play fail
        return false;
    }

    // check play status
    if (mainAudioController.paused) {
        // play fail
        return false;
    }

    // toggle button status
    $('#mainMusicControlButton').removeClass('stopped');

    return true;
}

/**
 * pause music
 * pause audio use audio element with ID: mainAudioController
 * @return boolean
 */
function pauseMusic()
{
    // get audio element
    var mainAudioController = getElement('mainAudioController');
    if (!mainAudioController) {
        // audio controller not exist
        return false;
    }

    // try to pause
    mainAudioController.pause();

    // check play status
    if (!mainAudioController.paused) {
        // still playing, pause fail
        return false;
    }

    // toggle button status
    $('#mainMusicControlButton').addClass('stopped');

    return true;
}

/**
 * get music play status
 * get audio play status use audio element with ID: mainAudioController
 * @return boolean
 */
function getMusicPlayStatus()
{
    // get audio element
    var mainAudioController = getElement('mainAudioController');
    if (!mainAudioController) {
        // audio controller not exist
        return false;
    }

    // return status
    return !mainAudioController.paused;
}

/**
 * toggle music
 * toggle audio play status use audio element with ID: mainAudioController
 * @return boolean
 */
function toggleMusic()
{
    // check status
    if (getMusicPlayStatus()) {
        // playing then pause
        return pauseMusic();
    }
    else {
        // pausing then play
        return playMusic();
    }
}

/**
 * play letter
 */
function playLetter(sentence_index, delay)
{
    // default index
    sentence_index ? null : sentence_index = 0;

    // get sentences
    var letter_sentences = $('#letter_content_box > *');

    // check index
    if (sentence_index + 1 > letter_sentences.length) {
        return;
    }

    // show sentence
    letter_sentences.eq(sentence_index).fadeIn(3000);
    window.setTimeout(function ()
    {
        playLetter(sentence_index + 1, delay)
    }, delay);
}

/**
 * auto load missing dependencies library
 * recommend use single page app framework and quote all required libraries.
 * only use loadDependencies in non-single page
 */
function loadDependencies()
{
    // check jQuery
    if (inArray(new String('jQuery').toLowerCase(), dependencies) && typeof(jQuery) === "undefined")
    {
        if (getBrowserLanguage() === 'zh-cn')
        {
            document.body.appendChild(createElement('script', {src: cdnList.china.jquery}));
        }
        else
        {
            document.body.appendChild(createElement('script', {src: cdnList.world.jquery}));
        }
    }

    // check moment library
    if (inArray('moment', dependencies) && typeof(moment) === "undefined")
    {
        if (getBrowserLanguage() === 'zh-cn')
        {
            document.body.appendChild(createElement('script', {src: cdnList.china.momentWithLocales}));
        }
        else
        {
            document.body.appendChild(createElement('script', {src: cdnList.world.momentWithLocales}));
        }
    }
}

/**
 * include missing dependencies library
 */
function includeDependencies()
{
    // check jQuery
    if (inArray(new String('jQuery').toLowerCase(), dependencies) && typeof(jQuery) === "undefined")
    {
        if (getBrowserLanguage() === 'zh-cn')
        {
            printTag('script', {src: cdnList.china.jquery});
        }
        else
        {
            printTag('script', {src: cdnList.world.jquery});
        }
    }

    // check moment library
    if (inArray('moment', dependencies) && typeof(moment) === "undefined")
    {
        if (getBrowserLanguage() === 'zh-cn')
        {
            printTag('script', {src: cdnList.china.momentWithLocales});
        }
        else
        {
            printTag('script', {src: cdnList.world.momentWithLocales});
        }
    }
}

/**
 * load a file content
 * @param url       String
 * @param options   Object
 * - dataType  String  file type, default 'text'
 * - error      Function
 * - afterLoad  Function
 * --- result param  String|Object
 */
function loadFile(url, options)
{
    typeof (options) === 'undefined' ? options = {} : null;
    var dataType    = options.dataType || 'text';
    var error       = options.error || null;
    var afterLoad   = options.afterLoad || null;
    $.ajax(url, {
        dataType : dataType,
        success : function (result){
            if (afterLoad)
            {
                afterLoad(result);
            }
        },
        error : error,
    });
}

/**
 * load a html file content
 * @param url       String
 * @param element   HTMLElement
 * @param options   Object   $.ajax options param
 */
function loadHtml(url, element, options)
{
    typeof (options) === 'undefined' ? options = {} : null;
    options.dataType    = 'html';
    options.success     = (function(result)
    {
        var jElement = $(element);
        jElement.after(result);
        jElement.remove();
    });
    $.ajax(url, options);
}

/**
 * load a html file content
 * @param url       String
 * @param target    HTMLElement
 * @param options   Object
 */
function loadAppendHtml(url, target, options)
{
    typeof (options) === 'undefined' ? options = {} : null;
    options.dataType    = 'html';
    options.success     = (function(result){
        $(target).append(result);
    });

    $.ajax(url, options);
}

/**
 * get session storage
 * @key  String  data key string
 * @return  String|null
 */
function getSessionData(key)
{
    if (typeof(sessionStorage) === "undefined")
    {
        return null
    }

    return sessionStorage.getItem(key);
}

/**
 * set session storage
 * @key     String  data key string
 * @value   String  value
 * @return  boolean  success or not
 */
function setSessionData(key, value)
{
    if (typeof(sessionStorage) === "undefined")
    {
        return false
    }

    sessionStorage.setItem(key, value);
    return true;
}

/**
 * remove session storage
 * @key     String      data key string
 * @return  boolean     success or not
 */
function removeSessionData(key)
{
    if (typeof(sessionStorage) === "undefined")
    {
        return false
    }

    sessionStorage.removeItem(key);
    return true;
}

/**
 * get cache data, using local storage.
 * @key  String  data key string
 * @return  String|null
 */
function getCacheData(key)
{
    if (typeof(localStorage) === "undefined")
    {
        return null
    }

    return localStorage.getItem(key);
}

/**
 * set cache data, using local storage.
 * @key     String  data key string
 * @value   String  value
 * @return  boolean  success or not
 */
function setCacheData(key, value)
{
    if (typeof(localStorage) === "undefined")
    {
        return false
    }

    localStorage.setItem(key, value);
    return true;
}

/**
 * remove cache data, using local storage.
 * @key     String  data key string
 * @return  boolean  success or not
 */
function removeCacheData(key)
{
    if (typeof(localStorage) === "undefined")
    {
        return false;
    }

    localStorage.removeItem(key);
    return true;
}

/**
 * initialize tree view
 * @param Object(HTMLElement)|String  treeview element or CSS selector string
 */
function initTreeView(treeView)
{
    var treeviewEle = $(treeView);

    var folderName = treeviewEle.find('.folderNode .folderIcon, .folderNode .folderName');
    folderName.on('click', function(){
        var folderNode = $(this).parent().parent();
        folderNode.toggleClass('extended');
    });
}

/**
 * set UI setting, save in local storage.
 * @param name  String  setting name
 * @param value String  setting value
 */
function setUISetting(name, value)
{
    var id = 'ui_setting_' + name;

    localStorage.setItem(id, value);
}

/**
 * get UI setting value, get data in local storage, if not found, then return default value.
 * @param name          String  setting name
 * @param defaultValue  String  default value, if not defined, then it's null
 * @returns {String|null}
 */
function getUISetting(name, defaultValue)
{
    defaultValue = defaultValue || null;

    var id = 'ui_setting_' + name;
    return localStorage.getItem(id) || defaultValue;
}

/**
 * init UI setting form
 * @param form  String|HTMLElement   element id or object
 * @param options  Object   special options
 * -- onchange  Function   extra action on controls's change
 * require jQuery library
 */
function initUISettingForm(form, options)
{
    if ( getDebugStatus() && existDebuggingContent('initUISettingForm') )
    {
        addDebugLog('init UI setting form.');
    }

    if (typeof(form) == "string")
    {
        form = getElement(form);
        if (!form)
        {
            addConsoleLog('[error] form not found.');
            return;
        }
    }

    options = options || {};
    var onchange = options.onchange || null;

    // set value and event
    for (var controlIndex = 0; controlIndex < form.length; controlIndex++)
    {
        var control     = form[controlIndex];
        var name            = control.name;
        var target          = control.dataset.target || 'body';
        var property        = control.dataset.property || "";
        var defaultValue    = control.dataset.default || "";
        var expression      = control.dataset.expression || "";
        if (!name)
        {
            continue;
        }
        if (!property)
        {
            addConsoleLog('[warnning] control missing data-property value.');
            continue;
        }

        // set change event
        $(control).on('change', function(event){

            var name        = this.name;
            var target      = this.dataset.target || 'body';
            var property    = this.dataset.property || "";
            var expression  = this.dataset.expression || "";
            var value       = this.value;

            if (!property)
            {
                addConsoleLog('[warnning] control missing data-property value.');
                return;
            }

            // save value
            setUISetting(name, value);

            // update style
            if (expression)
            {
                try
                {
                    eval('value = ' + expression)
                }
                catch (e)
                {
                    addConsoleLog('[error] ' + e.message);
                }
            }
            $(target).css(property, value);

            onchange ? onchange() : null;
        });

        // get setting value by name
        var setting = getUISetting(name);

        // update control's value if has special setting and is not a default value
        if (setting && setting != defaultValue)
        {
            setFormControl(form, name, setting);
            $(control).change();
        }
    }

    // trigger once change event
    onchange ? onchange() : null;
}

/**
 * apply native language, default use language in current language.
 * @param String language    native language code (lowercase), like 'zh-cn'.
 * @param String defaultLanguage   default language when native language not supported.
 * @param Array supportedList   list for languages supported.
 */
function applyNativeLanguage(language, defaultLanguage, supportedList, options)
{
    language = language || getBrowserLanguage() || defaultLanguage;
    language = language.toLowerCase();
    defaultLanguage = defaultLanguage || 'en-us';
    supportedList = supportedList || [];
    options = options || {};

    if (language == '' || !inArray(language, supportedList))
    {
        language = defaultLanguage;
    }

    // load language file
    loadLang(language, function(state){
        if (!state)
        {
            log('[error] load language fail.');
        }

        $('*[data-native]').each(function()
        {
            var text = '';

            if ($(this).attr('data-native') == '')
            {
                // get source key
                text = (this.nodeName.toLowerCase() == 'input') ? $(this).attr('placeholder') : this.innerHTML;

                // save source key
                $(this).attr('data-native', text);
            }
            else
            {
                // get source key
                text = $(this).attr('data-native');
            }

            if (text == '')
            {
                return;
            }

            // get native language text
            if (typeof(window.nativeLanguage) == 'undefined')
            {
                window.nativeLanguage = {};
            }

            var nativeLangText = typeof(window.nativeLanguage[text]) == 'string' ?
                window.nativeLanguage[text] : '';
            if (!nativeLangText)
            {
                return;
            }

            (this.nodeName.toLowerCase() == 'input') ? $(this).attr('placeholder', nativeLangText) : this.innerHTML = nativeLangText;

        }); // end elements: *[data-native] each function
    }, options);
}

/**
 * load a language file (json)
 * @param String path   relative path from lang folder to destination file (needn't ext name)
 * @param Function callback     callback, it run if success or not.
 */
function loadLang(path, callback, options)
{
    options = options || {};
    var baseUrl = options.baseUrl || '';
    path = baseUrl + './lang/' + path + '.json';
    $.ajax(path, {
        success : function (result){

            if (typeof(window.nativeLanguage) == 'undefined')
            {
                window.nativeLanguage = {};
            }

            for (var key in result)
            {
                window.nativeLanguage[key] = result[key];
            }

            if (callback)
            {
                callback(true, result);
            }
        },
        error : function (){
            if (callback)
            {
                callback(false, '');
            }
        }
    });
}

/**
 * init native language
 * get language setting from localStorage or cookie, and apply to current page.
 * @param options
 * (String)baseUrl : base url to lang folder
 * (String)defaultLanguage : default language
 * (Array)languageSupportedList : list for language support
 * @return String   current language
 */
function initNativeLanguage(options)
{
    var baseUrl = options.baseUrl || './';
    var defaultLanguage = options.defaultLanguage || 'en-us';
    var languageSupportedList = options.languageSupportedList || [defaultLanguage];

    var customLanguage = '';

    // try to get data in local storage,
    // but some browser not support or deny to use.
    if (typeof(localStorage) == "object")
    {
        try
        {
            customLanguage = localStorage.getItem('language') || '';
        }
        catch (e)
        {
            log(e);
        }
    }

    // try to get data from cookie,
    // but some browser disable cookie.
    if (!customLanguage)
    {
        try
        {
            customLanguage = $.cookie('language');
        }
        catch (e)
        {
            log(e);
        }
    }

    applyNativeLanguage(customLanguage, defaultLanguage, languageSupportedList, {
        baseUrl : baseUrl
    });

    return customLanguage;
}

/**
 * init the language selectbox
 * @param HTMLElement selectbox
 * @param Object options
 * (String)baseUrl : base url to lang folder
 * (String)defaultLanguage : default language
 * (String)currentLanguage : current language
 * (String)languageSupportedList : list for language supported
 */
function initLanguageSelectbox(selectbox, options)
{
    var baseUrl = options.baseUrl || './';
    var defaultLanguage = options.defaultLanguage || 'en-us';
    var currentLanguage = options.currentLanguage || defaultLanguage;
    var languageSupportedList = options.languageSupportedList || [];

    $(selectbox).val(currentLanguage).on('change', function()
    {
        var value = this.value;

        applyNativeLanguage(value, defaultLanguage, languageSupportedList, {
            baseUrl : baseUrl
        });

        // save custom language setting.

        var savedState = false;
        // try to save language setting in local storage
        // but some browser not support or deny to use.
        if (typeof(localStorage) == "object")
        {
            try
            {
                localStorage.setItem('language', value);
                savedState = true;
            }
            catch (e)
            {
                log(e);
            }
        }

        // try to save language setting in cookie
        // but some browser deny to use.
        if (!savedState)
        {
            try
            {
                savedState = $.cookie('language', value);
            }
            catch (e)
            {
                log(e);
            }
        }

    });
}

/**
 * parse a text to native language text
 * @param String text
 * @return String
 */
function parseNativeLang(text)
{
    if (typeof(window.nativeLanguage) == 'undefined')
    {
        window.nativeLanguage = {};
    }

    for (var key in window.nativeLanguage)
    {
        if (key == text)
        {
            return window.nativeLanguage[key];
        }
    }

    return text;
}

/**
 * init a block element auto move in window
 * @param  Object(HTMLElement) element
 */
function initAutoMoveInWindow(element)
{
    $(element).css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        bottom: 'auto',
        right: 'auto'
    }).attr('data-run', 'on');

    var moveStep;
    moveStep = function (element)
    {
        var status = element.dataset.run || 'on';
        if (status != 'on')
        {
            setTimeout(function (){
                moveStep(element);
            }, 1000);
            return;
        }

        var windowWidth = getWindowWidth();
        var windowHeight = getWindowHeight();

        var width = element.offsetWidth;
        var height = element.offsetHeight;
        var left = element.offsetLeft;
        var top = element.offsetTop;

        var leftRange = windowWidth - width;
        var topRange = windowHeight - height;

        var targetLeft = 0;
        var targetTop = 0;

        // direction, 1: top 2: right 3: bottom 4: left
        var dir = parseInt(element.dataset.dir || 1);
        dir = dir+1 > 4 ? 1 : dir+1;

        switch (dir)
        {
            case 1 :
                targetLeft = Math.random() * (leftRange - 1);
                break;
            case 2 :
                targetTop = Math.random() * (topRange - 1);
                targetLeft = leftRange;
                break;
            case 3 :
                targetLeft = Math.random() * (leftRange - 1);
                targetTop = topRange;
                break;
            case 4 :
                targetTop = Math.random() * (topRange - 1);
                break;
        }

        // speed : point/second
        var speed = parseInt(element.dataset.speed || 80);
        var distance = Math.sqrt(Math.pow(targetLeft - left, 2) + Math.pow(targetTop - top, 2));

        $(element).attr('data-dir', dir).animate({
            left : targetLeft,
            top : targetTop
        }, distance / speed * 1000, 'linear', function (){
            moveStep(element);
        });
    };

    moveStep(element);
}

/**************************
 * CKEditor
 ***************************/

/**
 * init CKEditor component
 * @param  HTMLElement|String  element quote or css selector string
 * @param  Function  callback(HTMLElement, editor)
 * @requires jQuery, CKEditor
 */
function initCKEditors(element, callback)
{
    // get editors
    var editors = $(element);
    if (!editors.length)
    {
        return;
    }

    editors.each(function ()
    {
        var control = this;
        var id = this.id;

        CKEDITOR.replace(id, {
            on: {
                /**
                 * @type  Function
                 * @param  Object  event
                 * - editor : Object
                 */
                instanceReady : function( event ) {
                    if (callback)
                    {
                        callback(control, event.editor);
                    }
                }
            }
        });

    });
}

/**
 * init CKEditor component by ID
 * @param  String  id  element id attribute
 * @param  Function  callback(HTMLElement, editor)
 * @requires jQuery, CKEditor
 * @return Object (ckeditor)
 */
function initCKEditorById(id, callback)
{
    return CKEDITOR.replace(id, {
        on: {
            /**
             * @type  Function
             * @param  Object  event
             * - editor : Object
             */
            instanceReady : function( event ) {
                if (callback)
                {
                    callback(control, event.editor);
                }
            }
        }
    });
}

/**
 * init vue list content
 * @param  Object  options
 * @return  Object(Vue)
 * @requires Vue, jQuery
 */
function initVueList(options)
{
    var elementSelector = options.el || '';
    var viewPageUrl     = options.viewPageUrl || '';
    var apiConfig       = options.apiConfig || {};
    var customData      = options.data || {};
    var customMethods   = options.methods || {};

    var loadFirstPage   = (typeof(options.loadFirstPage) !== 'undefined') ?
        options.loadFirstPage : true;
    var autoLoad    = options.autoLoad || false;

    var mounted    = options.mounted || false;
    var updated    = options.updated || false;

    var size        = options.size || 10;
    var pageParam   = options.pageParam || 'page';
    var sizeParam   = options.sizeParam || 'size';

    var filterColumns   = options.filterColumns || {};
    var checkingColumns = options.checkingColumns || null;

    var afterLoadData   = options.afterLoadData || null;
    /**
     * trigger before update list, prevent update if return false
     * @type {Function|null}
     * @param   Array   list
     * @param   Object  data    response data from server side api
     * @return  null|Boolean
     */
    var beforeUpdateList    = options.beforeUpdateList || null;
    var afterUpdateList     = options.afterUpdateList || null;
    var afterRemove     = options.afterRemove || null;
    var onLoadError     = options.onLoadError || null;

    var data = {
        initOptions : options,
        page : 1,
        size : size,
        count : 0,
        pageCount : 1,
        keywords : '',
        filters : filterColumns,
        list : [],
        dataList : [],
        ajaxLock : false,
        status : '',
        checkingColumns : checkingColumns
    };
    for (var key in customData)
    {
        data[key] = customData[key];
    }

    var methods = {

        /**
         * get item object in list by id
         * @param  String  id
         * @return {null|Object}
         */
        getItemById : function (id) {
            for (var i=0; i<this.list.length; i++)
            {
                if (this.list[i].id === id)
                {
                    return this.list[i];
                }
            }

            return null;
        },
        cleanList : function (){
            this.list = this.dataList = [];
        },
        checkColumns : function(list, columns){
            for (var i=0; i<list.length; i++)
            {
                for (var key in columns)
                {
                    var dataType = typeof(list[i][key]);
                    if ( dataType != columns[key] )
                    {
                        log('data type not match "' + columns[key] + '" with key:' + key);
                        if (getDebugStatus())
                        {
                            addConsoleLog(list[i]);
                        }
                    }
                }
            }
        },
        loadPage : function(page){

            if ( typeof(apiConfig.list) != 'object')
            {
                addConsoleLog('[error] list api not defined.');
                return;
            }

            if (this.ajaxLock)
            {
                return;
            }
            this.ajaxLock = true;

            if (page)
            {
                this.page = page;
            }
            var me = this;

            var params = apiConfig.list.params || {};
            params[pageParam] = this.page;
            params[sizeParam] = this.size;
            for (var key in this.filters)
            {
                if (this.filters[key])
                {
                    params[key] = this.filters[key];
                }
            }

            me.status = 'loading';

            $.ajax({
                url : apiConfig.list.url,
                type : apiConfig.list.method || 'get',
                data : params,
                success : function(result){

                    if (afterLoadData)
                    {
                        afterLoadData(result);
                    }
                    else
                    {
                        if (me.checkingColumns)
                        {
                            me.checkColumns(result.data.rows, checkingColumns);
                        }

                        if (beforeUpdateList)
                        {
                            var checking = beforeUpdateList(me.list, result.data);
                            if (checking === false)
                            {
                                return;
                            }
                        }

                        me.list         = me.dataList = me.list.concat(result.data.rows);
                        me.pageCount    = result.data.totalPage || 1;
                        me.count        = result.data.totalCount || me.list.length;

                        if (afterUpdateList)
                        {
                            afterUpdateList();
                        }
                    }

                    me.status = 'ready';
                },
                complete : function()
                {
                    me.status = 'ready';
                    me.ajaxLock = false;
                },
                error : function(XMLHttpRequest, errorText)
                {
                    me.status = 'error';
                    if (onLoadError)
                    {
                        onLoadError(XMLHttpRequest, errorText);
                    }
                }
            });
        },
        loadFirstPage : function(){

            // clean old data
            me.list = me.dataList = [];

            this.loadPage(1);
        },
        loadPrevPage : function(){

            if (this.page == 1)
            {
                return;
            }

            this.loadPage(this.page-1);
        },
        loadNextPage : function(){

            if (this.page + 1 > this.pageCount)
            {
                return;
            }

            this.loadPage(this.page+1);
        },
        onPageNumClick : function(event){
            this.loadPage(event.target.innerHTML);
        },
        // use in select element
        onPageNumChange : function (event){
            var page = parseInt(this.value) || 0;
            this.loadPage(page);
        },
        onQuery : function (event) {
            this.loadFirstPage();
        },
        // use in view button, need data-id attribute.
        onView : function(event) {

            var id = event.currentTarget.dataset.id;
            if (viewPageUrl)
            {
                location.href = viewPageUrl + '?id=' + id;
            }
        },
        // use in remove button, need data-id attribute.
        onRemove : function (event){

            var me = this;
            var target = event.currentTarget;
            var id = target.dataset.id || '';

            if (!window.confirm('确认要删除这些数据吗？（该操作不可逆）'))
            {
                return;
            }

            $.ajax({
                url : apiConfig.delete.url,
                type : apiConfig.delete.method || 'get',
                data : {
                    id : id
                },
                success : function (result){
                    var item = me.getItemById(id);
                    me.list = me.dataList = removeArrayElement(me.list, item);

                    if (afterRemove)
                    {
                        afterRemove(result);
                    }
                }
            });
        },
        init : function()
        {
            var me = this;
            if (loadFirstPage)
            {
                me.loadPage(1);
            }

            if (autoLoad != false)
            {
                initLoadMore({
                    bottomDistance : autoLoad
                }, function (){
                    me.loadNextPage();
                });
            }
        },
        formatDate : function (timestamp) {
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD');
        },
        formatDateTime : function (timestamp) {
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        },
        fromNowExpress : function(timestamp){
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).fromNow();
        }
    };
    for (var key in customMethods)
    {
        methods[key] = customMethods[key];
    }

    var vueController = new Vue({
        el : elementSelector,
        data : data,
        methods : methods,
        mounted : mounted,
        updated : updated
    });
    vueController.init();

    return vueController;
}

/**
 * init vue table list content
 * @param  Object  options
 * @return  Object(Vue)
 * @requires Vue, jQuery
 */
function initVueTableList(options)
{
    var elementSelector = options.el || '';
    var editingDialog   = options.editingDialog || '';
    var editingPageUrl  = options.editingPageUrl || '';
    var viewPageUrl     = options.viewPageUrl || '';
    var apiConfig       = options.apiConfig || {};
    var customData      = options.data || {};
    var customMethods   = options.methods || {};

    var size        = options.size || 10;
    var pageParam   = options.pageParam || 'page';
    var sizeParam   = options.sizeParam || 'size';

    var editingColumns  = options.editingColumns || {};
    var filterColumns   = options.filterColumns || {};

    var afterLoadData   = options.afterLoadData || null;

    var data = {
        page : 1,
        size : size,
        count : 0,
        pageCount : 1,
        keywords : '',
        filters : filterColumns,
        list : [],
        ajaxLock : false
    };
    for (var key in customData)
    {
        data[key] = customData[key];
    }

    var methods = {

        /**
         * load page's data
         * @param  Number  page
         */
        loadPage : function(page){

            if (this.ajaxLock)
            {
                return;
            }
            this.ajaxLock = true;

            if (page)
            {
                this.page = page;
            }
            var me = this;

            var params = apiConfig.list.params || {};
            params[pageParam] = this.page;
            params[sizeParam] = this.size;
            for (var key in this.filters)
            {
                if (this.filters[key])
                {
                    params[key] = this.filters[key];
                }
            }

            $.ajax({
                url : apiConfig.list.url,
                type : apiConfig.list.method || 'get',
                data : params,
                success : function(result){
                    if (afterLoadData)
                    {
                        afterLoadData(result);
                    }
                    else
                    {
                        me.list         = result.data.rows;
                        me.pageCount    = result.data.totalPage || 1;
                        me.count        = result.data.totalCount || me.list.length;
                    }
                },
                complete : function()
                {
                    me.ajaxLock = false;
                },
                error : appConfig.ajaxErrorHandle
            });
        },
        loadFirstPage : function(){
            this.loadPage(1);
        },
        loadPrevPage : function(){

            if (this.page == 1)
            {
                return;
            }

            this.loadPage(this.page-1);
        },
        loadNextPage : function(){

            if (this.page + 1 > this.pageCount)
            {
                return;
            }

            this.loadPage(this.page+1);
        },
        reload : function (){
            if (this.ajaxLock)
            {
                return;
            }
            this.loadPage();
        },
        onPageNumClick : function(event){
            this.loadPage(event.target.innerHTML);
        },
        onPageNumChange : function (event){
            var page = parseInt(this.value) || 0;
            this.loadPage(page);
        },
        onQuery : function (event) {
            this.loadFirstPage();
        },
        onAlter : function(event) {

            var id = event.target.dataset.id;
            if (editingDialog)
            {
                $(editingDialog).modal();
                this.editingDialogController.init();
                this.editingDialogController.loadData(id);
            }
            else if (editingPageUrl)
            {
                location.href = editingPageUrl + '?id=' + id;
            }
        },
        onView : function(event)
        {
            var id = event.target.dataset.id;
            if (viewPageUrl)
            {
                location.href = viewPageUrl + '?id=' + id;
            }
        },
        onSelectRow : function (event){
            var target = event.currentTarget;
            $(target).toggleClass('selected');
        },
        create : function(){
            if (editingDialog)
            {
                $(editingDialog).modal();
                this.editingDialogController.itemData = $.extend(editingColumns);
            }
            else if (editingPageUrl)
            {
                location.href = editingPageUrl;
            }
        },
        onRemove : function (){

            var me = this;
            var ids = this.getSelectedIds();

            if (ids.length < 1)
            {
                app.showMessageBox('请先勾选需要删除的数据。');
                return;
            }

            if (!window.confirm('确认要删除这些数据吗？（该操作不可逆）'))
            {
                return;
            }

            var taskCount = ids.length;
            var taskFinishedCount = 0;

            for (var i=0; i<ids.length; i++)
            {
                $.ajax({
                    url : apiConfig.delete.url,
                    type : apiConfig.delete.method || 'get',
                    data : {
                        id : ids[i]
                    },
                    complete : function (){
                        taskFinishedCount++;
                        if (taskFinishedCount==taskCount)   // all task are finish, then reload data
                        {
                            me.loadFirstPage();
                        }
                    }
                });
            }
        },
        // click event for delete button, need data-id param.
        onRemoveRow : function (event){
            var target = event.currentTarget;
            var id = target.dataset.id;
            var me = this;

            if (!window.confirm('确认要删除这条数据吗？（该操作不可逆）'))
            {
                return;
            }

            $.ajax({
                url : apiConfig.delete.url,
                type : apiConfig.delete.method || 'get',
                data : {
                    id : id
                },
                success : function (result){
                    me.reload();
                }
            });
        },
        init : function()
        {
            var me = this;
            me.loadPage(1);
        },
        /**
         * get selected id array
         * @returns  Array
         */
        getSelectedIds : function (){
            var rowCheckboxList = $(this.$el).find('table .rowCheckbox');
            var ids = [];
            for (var i=0; i<rowCheckboxList.length; i++)
            {
                var tId = rowCheckboxList.eq(i).attr('data-id');
                if (!tId) { continue; }

                var checked = rowCheckboxList[i].checked;
                if (checked)
                {
                    ids.push(tId);
                }
            }

            return ids;
        },
        checkAll : function (event)
        {
            // get check status
            var check_status = event.currentTarget.checked;

            $(this.$el).find('input[type="checkbox"]').each(function(){
                this.checked = check_status;
            });
        },
        formatDate : function (timestamp) {
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD');
        },
        formatDateTime : function (timestamp) {
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        },
        fromNowExpress : function(timestamp){
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).fromNow();
        }
    };
    for (var key in customMethods)
    {
        methods[key] = customMethods[key];
    }

    var vueController = new Vue({
        el : elementSelector,
        data : data,
        methods : methods
    });
    vueController.init();

    if (editingDialog)
    {
        vueController.editingDialogController = new Vue({
            el : editingDialog,
            data : {
                title : '编辑',
                itemData : $.extend(editingColumns)
            },
            methods : {
                init : function (){
                    var editors = $(this.el).find('.editor');
                    if (editors.length)
                    {
                        editors.each(function (){
                            CKEDITOR.replace(this.id);
                        });
                    }
                },
                loadData : function (id, callback){

                    var me = this;
                    $.ajax({
                        url : apiConfig.get.url,
                        type : apiConfig.get.method || 'get',
                        data : {
                            id : id
                        },
                        success : function(result){
                            me.itemData = result.data;

                            if (callback)
                            {
                                callback;
                            }
                        },
                        complete : function()
                        {
                            me.ajaxLock = false;
                        },
                        error : appConfig.ajaxErrorHandle
                    });
                },
                save : function (){

                    var me = this;

                    var editors = $(this.el).find('.editor');
                    if (editors.length)
                    {
                        editors.each(function (){
                            var editor = CKEDITOR.instances[this.id];
                            if (!editor)
                            {
                                return;
                            }

                            this.value = editor.getData();
                        });
                    }

                    var apiUrl      = this.itemData.id ? apiConfig.update.url : apiConfig.add.url;
                    var apiMethod   = this.itemData.id ? apiConfig.update.method : apiConfig.add.method;

                    $.ajax({
                        url : apiUrl,
                        method : apiMethod,
                        data : me.itemData,
                        success : function (result){

                        }
                    });
                }
            }
        });
    }

    return vueController;
}

/**
 * init vue item detail
 * @param  Object  options
 * @return  Object(Vue)
 * @requires Vue, jQuery
 */
function initVueItemDetail(options)
{
    var elementSelector = options.el || '';
    var apiConfig       = options.apiConfig || {};
    var customData      = options.data || {};
    var customMethods   = options.methods || {};

    var dataColumn      = options.dataColumn || [];
    var columnMapping   = options.columnMapping || {};

    var parentPage      = options.parentPage || {};
    var onSubmitSuccess = options.onSubmitSuccess || null;
    /**
     * call before submit data
     * @type null|Function
     * @param  Object  data
     */
    var beforeSubmit = options.beforeSubmit || null;
    var onDataLoaded    = options.onDataLoaded || null;
    var onLoadingError  = options.onLoadingError || null;
    var onMounted       = options.onMounted || null;
    var onCreated       = options.onCreated || null;
    var onUpdated       = options.onUpdated || null;

    var dataAttr = {};
    for (var i=0; i<dataColumn.length; i++)
    {
        dataAttr[dataColumn[i]] = null;
    }

    var data = {
        /* loading: ajax loading, ready: data loaded,  */
        status : '',
        itemData : dataAttr
    };
    for (var key in customData)
    {
        data[key] = customData[key];
    }

    var methods = {
        loadData : function (id, callback)
        {
            var me = this;
            this.status = 'loading';

            var data = JSON.parse(JSON.stringify(apiConfig.get.params || {}));

            var idParam         = apiConfig.get.idParam || 'id';
            if (id)
            {
                data[idParam] = id;
            }

            $.ajax({
                url : apiConfig.get.url,
                type : apiConfig.get.method || 'get',
                data : data,
                success : function(result){

                    me.status = 'ready';

                    var data = result.data;
                    // if (!data)
                    // {
                    //     return;
                    // }

                    // data process if need
                    if (onDataLoaded)
                    {
                        data = onDataLoaded(data, me);
                    }

                    // column convert
                    data = dataColumnConvert(data, columnMapping);  // data convert
                    // data = mergeObject(dataAttr, data);             // merge required columns and data

                    for (var key in data)
                    {
                        me.itemData[key] = data[key];
                    }

                    // do other something
                    if (callback)
                    {
                        callback(data);
                    }
                },
                error : function (XMLHttpRequest, errorText) {
                    me.status = 'error';
                    if (onLoadingError)
                    {
                        onLoadingError(XMLHttpRequest, errorText);
                    }
                }
            });
        },
        // use in remove button, need data-id attribute.
        onRemove : function (event){

            var me = this;
            var target = event.currentTarget;
            var id = this.itemData.id;

            if (!window.confirm('确认要删除数据吗？（该操作不可逆）'))
            {
                return;
            }

            $.ajax({
                url : apiConfig.delete.url,
                data : {
                    id : id
                },
                success : function (result){
                    location.href = parentPage ? parentPage : 'index.html';
                }
            });
        },
        formatDate : function (timestamp) {
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD');
        },
        formatDateTime : function (timestamp) {
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        },
        fromNowExpress : function(timestamp){
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).fromNow();
        }
    };
    for (var key in customMethods)
    {
        methods[key] = customMethods[key];
    }

    var vueController = new Vue({
        el : elementSelector,
        data : data,
        methods : methods,
        mounted : function (){

            this.status = 'mounted';

            var id = getUrlParam('id');
            if (!id)
            {
                // location.href = parentPage ? parentPage : 'index.html';
            }

            this.loadData(id);

            if (onMounted) { onMounted(this); }
        },
        created : function (){
            if (onCreated) { onCreated(this); }
        },
        updated : function (){
            if (onUpdated) { onUpdated(this); }
        }

    });
    return vueController;
}

/**
 * init vue form content
 * @param  Object  options
 * @return  Object(Vue)
 * @requires Vue, jQuery
 */
function initVueForm(options)
{
    var elementSelector = options.el || '';
    var apiConfig       = options.apiConfig || {};
    var customData      = options.data || {};
    var customMethods   = options.methods || {};

    var parentPage      = options.parentPage || {};
    var loadCategoryList    = options.loadCategoryList || false;

    var editingColumns  = options.editingColumns || {};
    var columnsMapping  = options.columnsMapping || {};
    var onSubmitSuccess = options.onSubmitSuccess || null;
    var onDataLoaded    = options.onDataLoaded || null;
    var onMounted       = options.onMounted || null;

    /**
     * trigger before upload file
     * @type {Function|null}
     * @param  Object (FormData)    formData
     * @param  Object (HTMLElement) control
     * @param  Object (Vue controller)
     * @return Boolean  false to prevent upload
     */
    var onBeforeUpload  = options.onBeforeUpload || null;

    /**
     * trigger after upload file
     * @type    {Function|null}
     * @param   *       result      response data
     * @param   String  textStatus  response status text
     * @param   Object  jqXHR       jQuery XHR object
     * @param   Object  vueControl  Vue controller object
     */
    var onAfterUpload   = options.onAfterUpload || null;

    /**
     * trigger when upload file fail
     * @type {Function|null}
     */
    var onUploadError   = options.onUploadError || null;

    var data = {
        title : '编辑',
        editors : [],
        status : '',
        itemData : cloneObject(editingColumns),
        categoryList : []
    };
    for (var key in customData)
    {
        data[key] = customData[key];
    }

    /**
     * call before submit data
     * @type null|Function
     * @param  Object  data
     */
    var beforeSubmit = options.beforeSubmit || null;

    var methods = {
        init : function (){

            if (loadCategoryList)
            {
                this.loadCategoryList();
            }
        },
        loadCategoryList : function (){
            var me = this;
            $.ajax({
                url : apiConfig.categoryList.url,
                type : apiConfig.categoryList.method || 'get',
                data : apiConfig.categoryList.params || {},
                success : function (result){
                    me.categoryList = result.data;
                },
                error : function (){

                }
            });
        },
        initEditors : function (callback){
            initCKEditors('.editor', callback);
        },
        loadData : function (id, callback)
        {
            var data = JSON.parse(JSON.stringify(apiConfig.get.params || {}));
            if (id)
            {
                data.id = id;
            }

            var me = this;
            $.ajax({
                url : apiConfig.get.url,
                type : apiConfig.get.method || 'get',
                data : data,
                success : function(result){

                    var data = result;

                    // data process if need
                    if (onDataLoaded)
                    {
                        data = onDataLoaded(data, me);
                    }
                    me.itemData = data;

                    // do other something
                    if (callback)
                    {
                        callback(data);
                    }
                },
                complete : function()
                {
                    me.ajaxLock = false;
                },
                error : appConfig.ajaxErrorHandle
            });
        },
        updateEditors : function (){
            for (var i=0; i<this.editors.length; i++)
            {
                var tId     = this.editors[i].id;
                var text    = $('#' + tId).val();
                this.editors[i].setData(text);
            }
        },
        onChangeForUpload : function (event){

            var me = this;
            var control = event.currentTarget;

            if (this.status === 'loading')
            {
                return;
            }

            // build form data
            var formData = new FormData();

            var params = apiConfig.upload.params || {};
            for (var key in params)
            {
                formData.append(key, params[key]);
            }

            for (var i=0; i<control.files.length; i++)
            {
                formData.append(control.name || 'file', control.files[i]);
            }

            if (onBeforeUpload)
            {
                var check = onBeforeUpload(formData, control, me);
                if (!check)
                {
                    return;
                }
            }

            this.status = 'loading';

            $.ajax({
                url : apiConfig.upload.url,
                type : 'post',
                dataType : 'json',
                data: formData,
                contentType: false,
                processData: false,
                success : function (result, textStatus, jqXHR) {

                    if (onAfterUpload)
                    {
                        onAfterUpload(result, textStatus, jqXHR, me);
                    }

                },
                error : onUploadError,
                complete : function (){
                    me.status = 'ready';
                }
            });
        },
        save : function (){

            var me = this;

            var editors = $(this.$el).find('.editor');
            if (editors.length)
            {
                for (var i=0; i<editors.length; i++)
                {
                    var tEditor = CKEDITOR.instances[editors.eq(i).attr('id')];
                    if (!tEditor)
                    {
                        continue;
                    }

                    var content = tEditor.getData();

                    var key = editors.eq(i).attr('name');
                    if (key)
                    {
                        me.itemData[key] = content;
                    }
                    editors.eq(i).text(content);
                }
            }

            var apiUrl      = this.itemData.id ? apiConfig.update.url : apiConfig.add.url;
            var apiMethod   = this.itemData.id ? apiConfig.update.method : apiConfig.add.method;

            var data = cloneObject(me.itemData);
            for (var key in columnsMapping)
            {
                apiKey = columnsMapping[key];
                data[apiKey] = data[key];
                delete data[key];
            }

            if (beforeSubmit)
            {
                data = beforeSubmit(data);
                // check data, allow prevent submit.
                if (!data)
                {
                    return false;
                }
            }

            $.ajax({
                url : apiUrl,
                method : apiMethod,
                data : data,
                success : function (result){
                    if (onSubmitSuccess)
                    {
                        onSubmitSuccess(result);
                    }
                },
                error : appConfig.ajaxErrorHandle
            });

            return false;

        },  // end save function
        // use in remove button, need data-id attribute.
        onRemove : function (event){

            var me = this;
            var target = event.currentTarget;
            var id = this.itemData.id;

            if (!window.confirm('确认要删除数据吗？（该操作不可逆）'))
            {
                return;
            }

            $.ajax({
                url : apiConfig.delete.url,
                data : {
                    id : id
                },
                success : function (result){
                    location.href = parentPage ? parentPage : 'index.html';
                }
            });
        },
        formatDate : function (timestamp) {
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD');
        },
        formatDateTime : function (timestamp) {
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        },
        fromNowExpress : function(timestamp){
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).fromNow();
        }
    };
    for (var key in customMethods)
    {
        methods[key] = customMethods[key];
    }

    var vueController = new Vue({
        el : elementSelector,
        data : data,
        methods : methods,
        created : function (){

            log('vue created.');
            this.status = 'ready';
            this.init();

            var me = this;

            var id = getUrlParam('id');

            if (id)
            {
                // 必须先加载数据再初始化编辑器，否则 Vue 会重新渲染视图。
                me.loadData(id, function (){
                    setTimeout(function(){
                        me.initEditors();
                    }, 800);
                });
            }
            else
            {
                me.initEditors();
            }
        },
        mounted : function () {
            onMounted ? onMounted(this) : null;
        }
    });
    return vueController;
}

/**
 * get geography location
 * @param  Object  options
 * - type     String     location data type, default wgs84.
 * - success  Function
 * - error    Function
 */
function getLocation(options)
{
    typeof (options) != 'object' ? options = {} : null;
    var type    = options.type || 'wgs84';
    var success = options.success || null;
    var error   = options.error || null;

    if ( isWechat() && typeof (wx) == 'object') // wechat JSSDK
    {
        wx.getLocation({
            type: type, // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                if (success)
                {
                    success(res);
                }
            },
            error : function (){
                if (error)
                {
                    error(res);
                }
            }
        });
    }
    else if ( typeof(navigator.geolocation) != 'undefined')  // HTML5 BOM
    {
        navigator.geolocation.getCurrentPosition(
            //locationSuccess
            function(position){
                if (success)
                {
                    success(position);
                }
            },
            //locationError
            function(result){
                var errorType = ['您拒绝共享位置信息', '获取不到位置信息', '获取位置信息超时'];
                if (error)
                {
                    error(result);
                }
            }
        );
    }
}

