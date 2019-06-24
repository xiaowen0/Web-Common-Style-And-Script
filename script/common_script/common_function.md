# 前端公共函数 #

---

**修正浮点数**

fixFloatingPointNumber(number, bit)

指定某个数显示多少位小数，不足则补零。

**启用调试模式**

enableDebug() / openDebug()

**禁用调试模式**

disableDebug() / closeDebug()

**获取调试模式状态**

getDebugStatus()

**调试模式**

一般用于产品环境的调试，比如调试 Ajax、 微信 JSSDK，用于输出详细的错误信息。

**添加控制台日志**

addConsoleLog(text)

console.log 的兼容方法，会首先检查浏览器是否有 console 接口。

**添加调试信息日志**

addDebugLog(text) / log(text)

调试模式下，添加日志到控制台。

**添加错误日志到控制台**

addErrorLog(text)

**警告框显示调试信息**

alertDebugLog(text)

**打印对象**

printObject(object)

输出一个对象的详细信息到文档尾部

**克隆对象**

cloneObject(object)

**克隆数组**

cloneArray(array)

**合并对象**

mergeObject(obj1, obj2)

合并2个数组的属性，如果有相同属性，obj2 的覆盖 obj1 的，返回一个新对象。

**获取浏览器指纹**

getBrowserFingerPrinting()

**获取页面描述**

getPageDescription() / getPageDesc()

快速获取 <meta name="description"/> 的内容，如果标签不存在，则返回空字符串。

**获取页面图标**

getPageIcon()

页面图标 <link rel="shortcut icon" name="icon"/> 添加"name"属性，值为"icon"。可用该函数快速获取，如果标签不存在，则返回空字符串。

**重复字符串**

repeatString(string, times)

比如：repeatString('9', 4)，返回"9999"

**字符串全部替换**

str_replace(string, find, replace)

在 string 中，把 find 全部替换为 replace。

**替换数据**

replaceData(string, data)

data (Object) 中的 key 代表需要查找的字符串，value 代表找到的字符串替换成的新字符串。

**数据字段转换**

dataColumnConvert(data, mapping)

用来修改一个对象的属性名，mapping 指定一组 旧属性名 => 新属性名 的映射。

**数据列表字段转换**

listDataColumnConvert(list, mapping)

对 list 数组里每一个元素，执行数据字段转换操作。

**随机生成一个中文名**

getRandomChineseName()

**去除换行符**

removeLineBreak(string)

**去除空格**

removeSpace(string)

**去除 HTML 标签字符**

removeHtmlTag(html)

仅去除标签，保留原来标签里的内容

**过滤出 img 标签**

filterImgTag(html)

返回数组

**过滤出 img 标签的 url 列表**

filterImageUrlList(html)

返回数组

**转义 HTML 代码**

escapeHtml(html)

**移除行首的空格**

removeSpaceInAheadOfLine(string)

**根据某个属性值过滤数据列表**

getObjectInListByKey(list, key, value)

在 list 里查找 key 的值为 value 的对象，返回一个数组。

**把一个对象或数组转成可读性强的字符串**

data2String(data)

**创建 URL 网址**

createUrl(url, params)

url 基本网址，params 可额外添加网址参数。

**从一个 url 里获取文件名**

getUrlFileName(url)

**从一个 html 代码里获取 body 的代码块**

getBodyHtml(html)

**检查一个路径是否为根路径**

isRootPath(path)

**根据一个 url ，获取它的上级 url**

getParentFolder(url)

**调整 url 字符串**

adjustUrl(url)

把 .. 换成上级，把 . 去掉

**连接 url 路径**

concatPath(path1, path2)

比如 concatPath('/abc', 'to/jquery')，返回"/abc/to/jquery"

**获取 url 绝对路径**

getAbsoluteBaseUrl()

添加协议、主机名、端口号（如果不是默认）

**检查一个值是否在一个数组里**

inArray(value, array)

**移除数组元素**

removeArrayElement(array, element)

array 里移除元素与 element 相等的元素。比如 removeArrayElement([1,2,2], 2)，返回 [1]。

**获取新鲜时间的描述**

getFreshText(time_str)

返回“10分钟前”之类的描述。

**格式化时间描述**

formatTime(format, time)

依赖 Moment 库，format 指定"YYYY-MM-DD HH:mm:ss"之类的表达式，

**根据一个时间表达式，获取是上午还是下午**

getAMPM(time, format)

依赖 Moment 库，time 指定类似"2011-01-01 18:16:58"的时间表达式，format 指定 time 对应的类似"YY-MM-dd HH:mm:ss"的时间格式。

返回 am 或 pm

**在一个元素打印时间**

printTime(element, format)

依赖 Moment 库，element 指定一个 HTMLElement 对象或 jQuery 选择符。

**获取现在的时间**

getNowTime(format)

format 指定时间表达的格式，默认为"YYYY-MM-DD H:mm:ss"。

**设置一个元素倒计时**

countBackwards(element, options)

设置一个元素倒计时，element 指定一个 HTMLElement 对象，内容必须是整型数字，options 指定功能的额外选项。

options.callback 可指定一个倒数结束后的回调函数。

**根据一个ID获取元素**

getElement(id)

**根据CSS选择符获取一个元素**

get(selector)

该接口使用 querySelector 接口，如果该接口不存在，则会返回 false 。

返回 HTMLElement 或 false

**创建一个HTML元素**

createElement(name, options, content)

name 指定元素名称，options 指定元素的属性，content 指定元素的内容。

**打印一个 HTML 标记**

printTag(name, options, content)

只能在 document 渲染结束之前执行，参数与 createElement 的一样。

**打印输出一个样式表链接**

printStylesheetLink(url)

只能在 document 渲染结束之前执行。

**加载样式表**

loadStylesheet(url)

**检查一个 url 是不是引用 CSS 文件**

isCSSFile(url)

**加载一个脚本**

loadScript(url, options)

options.onload 可指定脚本加载后的回调函数。

**检查一个 url 是不是引用脚本文件**

isScriptFile(url)

脚本文件目前只支持 *.js 一种。

**运行一个外部脚本**

execScript(url, callback)

callback(error, text) 可指定回调函数，当加载出错或运行出错时， error 是一个对象，运行成功时，text 是脚本内容。

**下载文件，打开下载对话框**

downloadFile(url)

直接下载，而不是在浏览器上预览。

**设置元素高度等于宽度**

setHeightEqualToWidth(element)

**重新加载图片**

reloadImage(image)

多用于验证码图片的刷新，添加4位随机数字在url后面。

**设置图片填充容器**

setImageFill(image)

先尝试宽度100%的情况下，图片自适应高度能否布满容器高度，如果不能，则设置100%高度，宽度自适应。

**检查一个文件名是否图片**

isImage(name)

目前支持 "jpg","jpeg","png","gif","svg"

**设置一个元素在容器里垂直居中**

setElementMiddlePosition(element)

原理：取容器高度，减去元素高度，再除以2，设置为上边距。

**加载图片**

loadImage(url, options)

options 可额外设置图片的事件。

一般用于一些图标文件的预加载

**创建一个图片对象**

createImage(url, options)

options 可额外指定对象的属性。

返回 Image 对象。

**初始化 Vue 列表**

initVueList(options)

options 指定 Vue 列表的功能：

* el             作用域范围的顶部元素
* viewPageUrl    查看页面的网址
* apiConfig      API 配置
* data           额外数据
* methods        额外方法
* autoLoad       是否自动加载第一页数据，默认为 false
* size           每页显示的数据数量
* pageParam      页码参数名
* sizeParam      数量参数名
* filterColumns  用于过滤的字段名列表
* afterLoadData  加载数据之后的回调函数
* onLoadError    加载出错时的回调函数

API 配置：

{

    list : {
        url : 'api/article/list'
    },
    show : {
        url : 'api/article/show',
        method : 'post'
    }
}

每一个元素为一个 API，一个 API 里面必须有一个 url 属性，method 属性默认为“GET”。

返回一个 Vue 对象

该对象自带属性：

* page       当前页码
* size       每页的数据尺寸
* count      数据总数
* pageCount  页码总数
* keywords   关键词
* filters    过滤的参数
* list       数据列表
* ajaxLock   是否锁定 Ajax，在 Ajax 请求过程中，该属性为 true
* status     状态描述，loading 代表 Ajax 请求中，error 代表加载数据出错，ready 代表数据加载完毕。

该对象自带方法：

* loadPage(page)  根据页码加载数据
* loadFirstPage() 加载第一页数据
* loadPrevPage()  加载前一页数据
* loadNextPage()  加载下一页数据
* onPageNumClick  页码按钮的绑定事件，加载元素代表的页码
* onPageNumChange 页码输入控件的绑定事件，加载元素代表的页码
* onQuery         查询按钮的绑定事件
* onView          数据查看详情的绑定事件，需要在元素上绑定 data-id 为 item 的 id
* onRemove        数据删除的绑定事件，需要在元素上绑定 data-id 为 item 的 id
* formatDate      把时间戳数据格式化为一个具有可读性的日期文本
* formatDateTime  把时间戳数据格式化为一个具有可读性的事件文本




