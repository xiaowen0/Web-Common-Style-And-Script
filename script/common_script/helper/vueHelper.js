import Vue from 'vue/dist/vue.min'
import VuejsDialog from "vuejs-dialog"
import "vuejs-dialog/dist/vuejs-dialog.min.css"
import consoleHelper from './consoleHelper'
import objectHelper from './object'

Vue.use(VuejsDialog);

var vueCommonOptions = {
    data : {
        initOptions : {}
    },
    methods : {
        getOption : function (name) {
            if ( typeof (this.initOptions[name]) != 'undefined' )
            {
                return this.initOptions[name];
            }
            return null;
        },
        uploadImage : function (options){
            consoleHelper.logDebug('upload images.');

            typeof (options) === 'object' ? null : options = {};

            options.url     = options.url || this.initOptions.apiConfig.uploadImage.url;
            options.type    = options.method || options.type || this.initOptions.apiConfig.uploadImage.method || 'POST';
            options.dataType    = options.dataType || this.initOptions.apiConfig.uploadImage.dataType || 'json';
            options.contentType = options.contentType || this.initOptions.apiConfig.uploadImage.contentType || false;
            options.processData = options.processData || this.initOptions.apiConfig.uploadImage.processData || false;
            var name        = options.name || this.initOptions.apiConfig.uploadImage.name || 'file';
            var data        = options.data || this.initOptions.apiConfig.uploadImage.params || {};
            var files       = options.files || [];
            var onProgress  = options.onProgress || null;

            var me = this;

            // build form data
            var formData = new FormData();
            for (var key in data)   // extra params
            {
                formData.append(key, data[key]);
            }
            for (var i=0; i<files.length; i++)  // file data
            {
                formData.append(name || 'file', files[i]);
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
    }
};

/**
 * helper for init some vue component
 */
var helper = {

    /**
     * init vue list content
     * @param  Object  options
     * @return  Object(Vue)
     * @requires Vue, jQuery
     */
    initList : function(options)
    {
        var elementSelector = options.el || '';
        var viewPageUrl     = options.viewPageUrl || '';
        var apiConfig       = options.apiConfig || {};
        var customData      = options.data || {};
        var customMethods   = options.methods || {};

        // visible group
        var visible         = true;
        if (typeof (options.visible) !== 'undefined')
        {
            visible = options.visible;
        }

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

        var components       = options.components || {};

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
            // visible group
            visible : visible,
            initOptions : options,
            page : 1,
            size : size,
            count : 0,
            pageCount : 1,
            keywords : '',
            filters : filterColumns,
            list : [],
            selectedList : [],
            apiConfig : apiConfig,
            ajaxLock : false,
            status : '',
            checkingColumns : checkingColumns,
            /**
             * map to external controller, it can output some signals.
             */
            viewPageUrl : viewPageUrl || '',
            outputMap : {}
        };
        for (var key in customData)
        {
            data[key] = customData[key];
        }

        var methods = {

            /*************************************
            * display methods
            *************************************/

            show : function () { this.visible = true; },

            hide : function () { this.visible = false; },

            clearAndReload : function() {
                this.list = [];
                this.loadFirstPage();
            },

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
                this.list = [];
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
                            if (consoleHelper.getDebugStatus())
                            {
                                consoleHelper.log(list[i]);
                            }
                        }
                    }
                }
            },
            loadPage : function(page){

                if ( typeof(apiConfig.list) != 'object')
                {
                    consoleHelper.log('[error] list api not defined.');
                    return;
                }

                if (this.ajaxLock)
                {
                    return;
                }
                this.ajaxLock = true;

                var me = this;

                // clone api extra params
                var data = objectHelper.clone(this.apiConfig.list.params || {});

                // add filter's params
                // data = objectHelper.merge(data, this.filters);
                for (var key in this.filters)
                {
                    if (this.filters[key])
                    {
                        params[key] = this.filters[key];
                    }
                }

                var pageName        = this.apiConfig.list.pageName || 'page';
                var pageSizeName    = this.apiConfig.list.pageSizeName || 'limit';

                var dataPath        = this.apiConfig.list.dataPath || 'data.rows';
                var totalPath       = this.apiConfig.list.totalPath || 'data.total';
                var totalPagePath   = this.apiConfig.list.totalPage || 'data.totalPage';

                // add page params
                data[pageName]      = this.page;
                data[pageSizeName]  = this.size;

                consoleHelper.logDebug('data:');
                consoleHelper.logDebug(data);

                me.status = 'loading';

                $.ajax({
                    url : apiConfig.list.url,
                    type : apiConfig.list.method || 'get',
                    data : data,
                    success : function(result){

                        me.status = 'ready';

                        if (afterLoadData)  // use custom handler
                        {
                            afterLoadData(result, me);
                            return;
                        }

                        var data        = objectHelper.getDataByKeyPath(result, dataPath);
                        var total       = objectHelper.getDataByKeyPath(result, totalPath);
                        var totalPage   = objectHelper.getDataByKeyPath(result, totalPagePath);

                        if (me.checkingColumns)
                        {
                            me.checkColumns(me.list, checkingColumns);
                        }

                        if (beforeUpdateList)
                        {
                            var checking = beforeUpdateList(me.list, data, me);
                            if (checking === false)
                            {
                                return;
                            }
                        }

                        me.list         = me.list.concat(data);
                        me.pageCount    = total || 1;
                        me.count        = totalPage || me.list.length;

                        if (afterUpdateList)
                        {
                            afterUpdateList(me);
                        }

                    },
                    complete : function()
                    {
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
                this.list = [];
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
                this.cleanList();
                this.loadFirstPage();
            },
            /**
             * add a output channel
             * @param  String  id
             * @param  Object  control
             */
            addOutput : function (id, control){
                this.outputMap[id] = control;
            },
            /**
             * output signal
             * @param  Object  signal information
             */
            outputSignal : function (signal){
                for (var key in this.outputMap)
                {
                    if (typeof(this.outputMap[key].inputSignal) === 'undefined')
                    {
                        consoleHelper.log('[warning] inputSignal method not exist in ' + key + ' output control.');
                        continue;
                    }
                    this.outputMap[key].inputSignal(signal);
                }
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
                if (!viewPageUrl)
                {
                    consoleHelper.log('Missing viewPageUrl param.');
                    return;
                }
                location.href = viewPageUrl + '?id=' + id;
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
                        me.list = removeArrayElement(me.list, item);

                        if (afterRemove)
                        {
                            afterRemove(result);
                        }
                    }
                });
            },
            // click event for batch delete button
            onRemoveRows : function (event){

                var me = this;

                if (!window.confirm('确认要删除这些数据吗？（该操作不可逆）'))
                {
                    return;
                }

                var idName = apiConfig.batchDelete.idName || 'id';
                var data = {};
                data[idName] = me.selectedList.join(',');

                $.ajax({
                    url : apiConfig.batchDelete.url,
                    type : apiConfig.batchDelete.method || 'get',
                    data : data,
                    success : function (result){
                        me.reload();
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
            extends : vueCommonOptions,
            data : data,
            methods : methods,
            mounted : mounted,
            updated : updated,
            components : components
        });
        vueController.init();

        return vueController;
    },

    /**
     * init vue table list content
     * @param  Object  options
     * @return  Object(Vue)
     * @requires Vue, jQuery
     */
    initTableList : function(options)
    {
        var elementSelector = options.el || '';
        var editingDialog   = options.editingDialog || '';
        var editingPageUrl  = options.editingPageUrl || '';
        var viewPageUrl     = options.viewPageUrl || '';
        var apiConfig       = options.apiConfig || {};
        var customData      = options.data || {};
        var customMethods   = options.methods || {};

        // visible group
        var visible         = true;
        if (typeof (options.visible) !== 'undefined')
        {
            visible = options.visible;
        }

        var size        = options.size || 10;
        var pageParam   = options.pageParam || 'page';
        var sizeParam   = options.sizeParam || 'size';

        var editingColumns  = options.editingColumns || {};
        var filterColumns   = options.filterColumns || {};

        var components       = options.components || {};

        var afterLoadData   = options.afterLoadData || null;

        var data = {
            initOptions : options,
            // visible group
            visible : visible,
            page : 1,
            size : size,
            count : 0,
            pageCount : 1,
            keywords : '',
            filters : filterColumns,
            list : [],
            ajaxLock : false,
            /**
             * map to external controller, it can output some signals.
             */
            outputMap : {}
        };
        for (var key in customData)
        {
            data[key] = customData[key];
        }

        var methods = {

            /*************************************
             * display methods
             *************************************/

            show : function () { this.visible = true; },

            hide : function () { this.visible = false; },

            clearAndReload : function() {
                this.list = [];
                this.loadFirstPage();
            },
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
                            afterLoadData(result, me);
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
            /**
             * add a output channel
             * @param  String  id
             * @param  Object  control
             */
            addOutput : function (id, control){
                this.outputMap[id] = control;
            },
            /**
             * output signal
             * @param  Object  signal information
             */
            outputSignal : function (signal){
                for (var key in this.outputMap)
                {
                    if (typeof(this.outputMap[key].inputSignal) === 'undefined')
                    {
                        consoleHelper.log('[warning] inputSignal method not exist in ' + key + ' output control.');
                        continue;
                    }
                    this.outputMap[key].inputSignal(signal);
                }
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
            // click event for batch delete button
            onRemoveRows : function (event){

                var me = this;

                if (!window.confirm('确认要删除这些数据吗？（该操作不可逆）'))
                {
                    return;
                }

                var idName = apiConfig.batchDelete.idName || 'id';
                var data = {};
                data[idName] = me.selectedList.join(',');

                $.ajax({
                    url : apiConfig.batchDelete.url,
                    type : apiConfig.batchDelete.method || 'get',
                    data : data,
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
            extends : vueCommonOptions,
            data : data,
            methods : methods,
            components : components
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
    },

    /**
     * init vue item detail
     * @param  Object  options
     * @return  Object(Vue)
     * @requires Vue, jQuery
     */
    initItemDetail : function(options)
    {
        var elementSelector = options.el || '';
        var apiConfig       = options.apiConfig || {};
        var customData      = options.data || {};
        var customMethods   = options.methods || {};

        var dataColumn      = options.dataColumn || [];
        var columnMapping   = options.columnMapping || {};
        var idParam         = options.idParam || 'id';

        // visible group
        var visible         = true;
        if (typeof (options.visible) !== 'undefined')
        {
            visible = options.visible;
        }

        var parentPage      = options.parentPage || 'index.html';
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

        var components       = options.components || {};

        var dataAttr = {};
        for (var i=0; i<dataColumn.length; i++)
        {
            dataAttr[dataColumn[i]] = null;
        }

        var data = {
            // visible group
            visible : visible,
            // options
            initOptions : options,
            /* loading: ajax loading, ready: data loaded,  */
            status : '',
            itemData : dataAttr,
            /**
             * map to external controller, it can output some signals.
             */
            outputMap : {}
        };
        for (var key in customData)
        {
            data[key] = customData[key];
        }

        var methods = {

            /*************************************
             * display methods
             *************************************/

            show : function () { this.visible = true; },

            hide : function () { this.visible = false; },

            loadData : function (id, callback)
            {
                var me = this;
                this.status = 'loading';
                var data = objectHelper.clone(apiConfig.get.params || {});

                data[apiConfig.get.idParam || 'id'] = id;

                $.ajax({
                    url : apiConfig.get.url,
                    type : apiConfig.get.method || 'get',
                    data : data,
                    success : function(result){

                        me.status = 'ready';

                        var data = result.data;
                        // data process if need
                        if (onDataLoaded)
                        {
                            data = onDataLoaded(data, me);
                        }

                        // column convert
                        data = dataColumnConvert(data, columnMapping);

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
            /**
             * add a output channel
             * @param  String  id
             * @param  Object  control
             */
            addOutput : function (id, control){
                this.outputMap[id] = control;
            },
            /**
             * output signal
             * @param  Object  signal information
             */
            outputSignal : function (signal){
                for (var key in this.outputMap)
                {
                    if (typeof(this.outputMap[key].inputSignal) === 'undefined')
                    {
                        consoleHelper.log('[warning] inputSignal method not exist in ' + key + ' output control.');
                        continue;
                    }
                    this.outputMap[key].inputSignal(signal);
                }
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
            extends : vueCommonOptions,
            data : data,
            methods : methods,
            mounted : function (){

                this.status = 'mounted';

                var id = getUrlParam(idParam);
                if (!id)
                {
                    location.href = parentPage ? parentPage : 'index.html';
                }

                this.loadData(id);

                if (onMounted) { onMounted(this); }
            },
            created : function (){
                if (onCreated) { onCreated(this); }
            },
            updated : function (){
                if (onUpdated) { onUpdated(this); }
            },
            components : components

        });
        return vueController;
    },

    /**
     * init vue form content
     * @param  Object  options
     * @return  Object(Vue)
     * @requires Vue, jQuery
     * signal type:
     * editData     load data with id param
     * createData   reset form data for editing new data
     * updateData   submit data with id
     * addData      submit a new data with null id
     * deleteData   delete a exist data with id
     */
    initForm : function(options)
    {
        var elementSelector = options.el || '';

        // style group
        var className       = options.className || '';
        var style           = options.style || '';

        // text group
        var title           = options.title || '';
        var submitButtonText    = options.submitButtonText || '提交';
        var cancelButtonText    = options.cancelButtonText || '取消';
        var deleteButtonText    = options.deleteButtonText || '删除';

        // visible group
        var visible         = true;
        if (typeof (options.visible) !== 'undefined')
        {
            visible = options.visible;
        }
        var showReturnButton    = true;
        if (typeof (options.showReturnButton) != 'undefined')
        {
            showReturnButton = options.showReturnButton;
        }

        // enable group
        var updatable       = true;
        if (typeof (options.updatable) != 'undefined')
        {
            updatable = options.updatable;
        }
        var deletable       = true;
        if (typeof (options.deletable) != 'undefined')
        {
            deletable = options.deletable;
        }

        var apiConfig       = options.apiConfig || {};

        var customData      = options.data || {};
        var customMethods   = options.methods || {};

        var parentPage      = options.parentPage || {};
        var loadCategoryList    = options.loadCategoryList || false;

        var editingColumns  = options.editingColumns || {};
        var columnsMapping  = options.columnsMapping || {};

        var components       = options.components || {};

        // event group
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

            // style group\
            className : className,
            style : style,

            // options
            initOptions : options,

            // text group
            title : '编辑',
            submitButtonText : submitButtonText,
            cancelButtonText : cancelButtonText,
            deleteButtonText : deleteButtonText,

            // visible group
            visible : visible,
            showReturnButton : showReturnButton,

            // enable group
            updatable : updatable,
            deletable : deletable,

            editors : [],
            status : '',
            itemData : cloneObject(editingColumns),
            categoryList : [],

            /**
             * map to external controller, it can output some signals.
             */
            outputMap : {}
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

            /*************************************
             * display methods
             *************************************/

            show : function () { this.visible = true; },

            hide : function () { this.visible = false; },

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
                var me = this;
                $.ajax({
                    url : apiConfig.get.url,
                    type : apiConfig.get.method || 'get',
                    data : {
                        id : id
                    },
                    success : function(result){

                        var data = result.data;

                        // data process if need
                        if (onDataLoaded)
                        {
                            data = onDataLoaded(result.data, me);
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
                    var apiKey = columnsMapping[key];
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
                            onSubmitSuccess(result, me);
                        }

                        // output signal
                        var signalMessage = {
                            type : me.itemData.id ? 'updateData' : 'addData',
                            data : me.itemData
                        };
                        me.outputSignal(signalMessage);
                    },
                    error : appConfig.ajaxErrorHandle
                });

                return false;

            },  // end save function
            /**
             * add a output channel
             * @param  String  id
             * @param  Object  control
             */
            addOutput : function (id, control){
                this.outputMap[id] = control;
            },
            /**
             * output signal
             * @param  Object  signal information
             */
            outputSignal : function (signal){
                for (var key in this.outputMap)
                {
                    if (typeof(this.outputMap[key].inputSignal) === 'undefined')
                    {
                        consoleHelper.log('[warning] inputSignal method not exist in ' + key + ' output control.');
                        continue;
                    }
                    this.outputMap[key].inputSignal(signal);
                }
            },
            /**
             * receive editing or creating order.
             * @param   Object  signalMessage
             * example : {
             *    type : '(required) filterFile',
             *    fileType : '',
             *    feeType '':
             * }
             */
            inputSignal: function (signalMessage) {

                if (signalMessage.type == 'editData') {

                    consoleHelper.logDebug('edia data.');

                    var id = signalMessage.id;

                    // load data
                    this.loadData(id);
                }
                else if (signalMessage.type == 'createData') {

                    consoleHelper.logDebug('create data.');

                    this.itemData = cloneObject(editingColumns);
                }
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

                        var signalMessage = {
                            type : 'deleteData',
                            id : id
                        };
                        me.outputSignal(signalMessage);
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
            extends : vueCommonOptions,
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
            components : components
        });
        return vueController;
    }

}

export default helper;
