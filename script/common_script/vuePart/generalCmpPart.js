import axios from '@util/axios'
import moment from 'moment';
import consoleHelper from '@util/consoleHelper';
import objectHelper from '@util/objectHelper';
import htmlHelper from '@util/htmlHelper';
import windowHelper from "@util/windowHelper";

/**
 * 通用组件零件
 * 包含：显示控制（用于抽屉、对话框等），输出信号，数据列表功能，数据项目功能
 */

export default {
    data() {
        return {

            app : (() => {
                var app = typeof (window.app) != 'undefined' ? window.app : null;
                return app;
            })(),

            visible : false,

            apiConfig : {
                list : {
                    url : '',
                    // method : 'get',
                    // params : {},
                    // pageName : 'page',
                    // pageSizeName : 'limit',
                    // dataPath : 'data.rows',
                    // totalPage : 'data.totalPage'
                },
                categoryList : {
                    url : '',
                },
                get : {
                    url : '',
                },
                update : {
                    url : '',
                },
                ad : {
                    url : '',
                },
                remove : {
                    url : '',
                },
            },

            dataList : [],
            dataItem : null,
            categoryList : [],

            enableDataList : false,
            enableDataItem : false,

            /**
             * @var String
             * 'loading',
             * 'ready',
             * 'error'
             */
            status : '',

            errorInfo : {
                status : 0,
                message : ''
            },

            // list data query config
            pageSize : 10,
            pagination : {
                current : 1,
                pageSize : 10,
                total : 0,
                totalPage : 1,
                showSizeChanger : true,
                showSizeChange : null,
                change : null
            },
            filters : {
                /*
                name : '',
                status : '',
                createTime : ''
                 */
            },

            /**
             * search inputbox setting
             */
            searchInputbox : {
                column : ''     // column name
            },

            autoLoadDataList : false,
            autoLoadDataItem : false,

            enableLottie : false,

            scrollControl: {
                viewContainer: window,
                scrollContainer: document.documentElement
            },

            scrollToLoadNextPage : 40,
            loadNextPageDelay : 500,

            /**
             * map to external controller, it can output some signals.
             */
            outputMap : {},

            suitableWidthRatio : 0.8
        }
    },
    methods : {

        // visible control methods

        show : function () {
            this.visible = true;
        },
        hide : function () {
            this.visible = false;
        },
        open : function () {
            this.visible = true;
        },
        close : function () {
            this.visible = false;
        },

        getSuitableWidth : function () {
            var w = windowHelper.getWidth();
            return w * this.suitableWidthRatio;
        },

        // data list operation methods

        loadDataList: function () {

            if (this.status === 'loading')
            {
                consoleHelper.logDebug('It\'s loading.');
                return;
            }

            var me = this;

            // clone api extra params
            var data = objectHelper.clone(this.apiConfig.list.params || {});

            // add filter's params
            // data = objectHelper.merge(data, this.filters);
            for (var key in this.filters)
            {
                if (this.filters[key])
                {
                    data[key] = this.filters[key];
                }
            }

            var pageName        = this.apiConfig.list.pageName || 'page';
            var pageSizeName    = this.apiConfig.list.pageSizeName || 'limit';

            var dataPath        = this.apiConfig.list.dataPath || 'data.rows';
            var totalPath       = this.apiConfig.list.totalPath || 'data.total';
            var totalPagePath   = this.apiConfig.list.totalPagePath || 'data.totalPage';
            var dataColumnMapping   = this.apiConfig.list.dataColumnMapping || {};

            // add page params
            data[pageName]      = this.pagination.current;
            data[pageSizeName]  = this.pagination.pageSize;

            consoleHelper.logDebug('data:');
            consoleHelper.logDebug(data);

            var url = this.apiConfig.list.url || '';
            var method = this.apiConfig.list.method || 'get';
            var params = this.apiConfig.list.params || {};
            params = objectHelper.merge(params, data);

            if (!url)
            {
                consoleHelper.logWarn('list api url not define, it can not load data.');
                return;
            }

            this.status = 'loading';
			this.onLoading ? this.onLoading() : null;

            var options = {
                url: url,
                method: method
            };
            if (method == 'get')
            {
                options.params = params;
            }
            else
            {
                options.data = params;
            }

            var app = this.app;
            if (!app)
            {
                consoleHelper.error('missing app quote.');
                return;
            }

            app.requestApi(options, (error, result) => {
                if (error) {
                    this.status = 'error';
                    this.onHttpError(error);
                    return;
                }

                this.status = 'ready';
                var data        = objectHelper.getDataByKeyPath(result, dataPath);
                var total       = objectHelper.getDataByKeyPath(result, totalPath);
                var totalPage   = objectHelper.getDataByKeyPath(result, totalPagePath);
                if (typeof(data) == 'undefined' || data == null)
                {
                    consoleHelper.logError('data is empty.');
                    return;
                }
                // debugger;
                data = objectHelper.listDataColumnConvert(data, dataColumnMapping);

                me.dataList             = me.dataList.concat(data);
                me.pagination.total     = total;
                me.pagination.totalPage = totalPage;

                this.onLoadDataList(data);
            });
        },

        reloadDataList : function (){
            this.dataList = [];
            this.pagination.current = 1;
            this.loadDataList();
        },

        loadNextPage : function () {

            consoleHelper.logDebug('load next page.');
            if (this.status === 'loading')
            {
                consoleHelper.logDebug('current status is loading, return.');
                return;
            }

            if (this.pagination.current == this.pagination.totalPage)
            {
                consoleHelper.logDebug("It's already last page.");
                return;
            }

            this.pagination.current++;
            this.loadDataList();

        },

        /*
         * methods for pagination
         */

        onChangePage: function (page, pageSize) {
            consoleHelper.logDebug('page=' + page);
            this.pagination.current = page;
            this.dataList = [];
            this.loadDataList();
        },
        onChangeSize: function (current, size) {
            consoleHelper.logDebug('size=' + size);
            this.pagination.current = 1;
            this.pagination.pageSize = size;
            this.dataList = [];
            this.loadDataList();
        },

        /*
         * methods for table
         */

        // pagination, filters, sorter, { currentDataSource })
        onTableChange : function (pagination){
            consoleHelper.logDebug(pagination);
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            this.dataList = [];
            this.loadDataList();
        },

        /**
         * methods for operation data item
         */

        resetDataItem : function () {
            for (var key in this.dataItem)
            {
                switch (typeof(this.dataItem[key])) {
                    case 'boolean' :
                        this.dataItem[key] = false;
                        break;
                    case 'number' :
                        this.dataItem[key] = 0;
                        break;
                    case 'string' :
                    default:
                        this.dataItem[key] = '';
                }
            }
        },

        loadDataItem : function (pk){
            var apiUrl = this.apiConfig.get.url;
            var apiMethod = this.apiConfig.get.method || 'get';
            var dataPath = this.apiConfig.get.dataPath || 'data';
            var idParam = this.apiConfig.get.idParam || 'id';

            if (!apiUrl)
            {
                consoleHelper.logWarn('Missing get data api url.');
                return;
            }

            var data = this.apiConfig.get.params || {};
            if (pk)     // my data not need id param
            {
                data[idParam] = pk;
            }

            var options = {
                url : apiUrl,
                method : apiMethod
            };
            if (apiMethod === 'get')
            {
                options.params = data;
            }
            else
            {
                options.data = data;
            }

            var app = this.app;
            if (!app)
            {
                consoleHelper.error('missing app quote.');
                return;
            }

            this.status = 'loading';
            app.requestApi(options, (error, result) => {

                if (error)
                {
                    this.status = 'error';
                    this.onHttpError(error);
                    return;
                }

                this.status = 'ready';

                var data        = objectHelper.getDataByKeyPath(result, dataPath);
                data = objectHelper.dataColumnConvert(data, this.apiConfig.get.dataColumnMapping || {});
                this.dataItem = data;

                this.onLoadDataItem(this);
            });

        },

        reloadDataItem : function (){
            this.loadDataItem(this.dataItem.id);
        },

        loadCategoryList : function (callback){

            // API params
            var apiUrl = this.apiConfig.categoryList.url;
            var apiMethod = this.apiConfig.categoryList.method || 'get';
            var dataPath = this.apiConfig.categoryList.dataPath || 'data.rows';
            var params = this.apiConfig.categoryList.params || {};

            // request options
            var options = {
                url : apiUrl,
                method : apiMethod,
                params : params
            };

            axios(options).then(res => {
                let data            = objectHelper.getDataByKeyPath(res.data, dataPath);
                this.categoryList   = data;
                if (callback) { callback(res, data) }
            }).catch(this.onHttpError);
        },

        save : function (){

            var apiUrl      = this.dataItem.id ? this.apiConfig.update.url : this.apiConfig.add.url;
            var apiMethod   = this.dataItem.id ?
                this.apiConfig.update.method || '' : this.apiConfig.add.method || '';
            var dataPath    = this.dataItem.id ?
                this.apiConfig.update.dataPath || 'data' : this.apiConfig.add.dataPath || 'data';
            var dataColumnsMapping = this.dataItem.id ?
                this.apiConfig.update.dataColumnMapping || {} :
                this.apiConfig.add.dataColumnMapping;

            var data = objectHelper.clone(this.dataItem);
            // column convert
            data = objectHelper.dataColumnConvertReverse(data, dataColumnsMapping);

            if (this.beforeSubmit)
            {
                data = this.beforeSubmit(data);
                // check data, allow prevent submit.
                if (!data)
                {
                    consoleHelper.logError('It must return data in beforeSubmit handler.');
                    return false;
                }
            }

            axios({
                url : apiUrl,
                method : apiMethod,
                data : data
            }).then(res => {

                if (this.onSubmitSuccess)
                {
                    this.onSubmitSuccess(objectHelper.clone(res.data));
                }

                var data = objectHelper.getDataByKeyPath(res.data, dataPath);

                if (!data)
                {
                    return;
                }
                this.dataItem = data;

                this.reset();
                if (this.close || null)
                {
                    this.close();
                }
                else if (this.hide || null)
                {
                    this.hide();
                }

                if (this.$parent && typeof(this.$parent.reloadData) == 'function')
                {
                    this.$parent.reloadDataList();
                }

                // output signal
                // var signalMessage = {
                //     type : me.itemData.id ? 'updateData' : 'addData',
                //     data : me.itemData
                // };
                // me.outputSignal(signalMessage);

            }).catch(error => {
                this.onSubmitError ? this.onSubmitError(error) : null;
            });
        },

        remove : function (){

            var me = this;

            this.$confirm({
                title : '确认',
                content : '确认要删除该项数据吗？',
                okText : '确认',
                okType : 'danger',
                cancelText : '取消',
                onOk() {
                    var apiUrl      = me.apiConfig.remove.url;
                    var apiMethod   = me.apiConfig.remove.method;

                    var data = {
                        id : me.dataItem.id
                    };

                    var options = {
                        url : apiUrl,
                        method : apiMethod
                    };
                    if (apiMethod === 'get')
                    {
                        options.params = data;
                    }
                    else
                    {
                        options.data = data;
                    }

                    axios(options).then(res => {
                        me.$success({
                            content : '删除成功'
                        });
                        me.reset();
                        if (me.close || null)
                        {
                            me.close();
                        }
                        else if (me.hide || null)
                        {
                            me.hide();
                        }

                        if (me.$parent)
                        {
                            me.$parent.reloadData();
                        }
                    }).catch(error => {

                        consoleHelper.logError('remove failed: ' + error.status + ' ' +error.statusText);

                        me.$error({
                            content : '删除失败'
                        });

                    });
                },
                onCancel() {

                }
            });
        },

        initLottie : function () {

            consoleHelper.logDebug('initLottie');

            if (typeof(bodymovin) === 'undefined')
            {
                consoleHelper.logWarn('Missing bodymovin lib.');
                return;
            }

            var root = this.$el;
            var lottieList = root.querySelectorAll('.lottie');

            for (var i=0; i<lottieList.length; i++)
            {
                var tItem   = lottieList[i];
                var path    = tItem.dataset.path || '';

                bodymovin.loadAnimation({
                    container: tItem, // Required
                    path: path, // Required
                    // renderer: 'svg/canvas/html', // Required
                    renderer : 'svg',
                    loop: true, // Optional
                    autoplay: true, // Optional
                    // name: "Hello World", // Name for future reference. Optional.
                });
            }

        },

        /*
         * methods for time format
         */

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

        formatDelayTime : function (timestamp) {
            if (!timestamp)
            {
                return '';
            }
            return moment(timestamp).fromNow();
        },

        /*
         * methods for internal search controls
         */

        onSearch : function (value){
            if (this.searchInputbox.column === '')
            {
                consoleHelper.logWarn('searchInputbox column is empty.');
                return;
            }

            this.filters[this.searchInputbox.column] = value;
            this.dataList = [];
            this.loadDataList();
        },


        getPlainText : function(html) {
            var text = htmlHelper.removeTag(htmlHelper.decode(html));
            return text;
        },

        // methods for external modules

        showSearchDialog : function () {
            var app = this.app;
            app ? app.searchDialog.show() : null;
        },

        getScrollContainer: function () {
            if (typeof (this.scrollControl.scrollContainer) == 'string') {
                return document.querySelector(this.scrollControl.scrollContainer);
            }

            return this.scrollControl.scrollContainer;
        },

        getViewContainer: function () {
            if (typeof (this.scrollControl.viewContainer) == 'string') {
                return document.querySelector(this.scrollControl.viewContainer);
            }

            return this.scrollControl.viewContainer;
        },

        // event for http request
        onHttpError : function () {},

        // event for data list
        onLoadDataList : function () {},

		/* before load data, status: loading */
		onLoading : function () {},

        // event for data item
        beforeSubmit : function (data) {
            return data;
        },

        /**
         * var null|funciton(responseData)
         */
        onSubmitSuccess : function () {},
        onLoadDataItem : function () {},
        onRemoveDataItem : function () {},

        onScroll : function(event) {

            var me = this;

            if (me.scrollToLoadNextPage == false) {
                consoleHelper.logDebug('scrollToLoadNextPage disabled.');
                return;
            }

            var bottomDistance = me.scrollToLoadNextPage;

            var viewContainer = this.getViewContainer();
            var scrollContainer = this.getScrollContainer();

            if (viewContainer == window)
            {
                var viewContainerHeight = viewContainer.innerHeight || viewContainer.offsetHeight;
                var scrollContainerHeight = scrollContainer.offsetHeight;
                var scrollContainerTop = windowHelper.getScrollTop() || scrollContainer.scrollTop;
                // consoleHelper.logDebug('viewContainerHeight: ' + viewContainerHeight +
                //     ' scrollContainerHeight: ' + scrollContainerHeight +
                //     ' scrollContainerTop: ' + scrollContainerTop);

                // check current element is display
                if (!scrollContainerHeight) {
                    consoleHelper.logDebug('scroll container height: ' + scrollContainerHeight);
                    return;
                }

                // consoleHelper.logDebug('bottom distance: ' + (scrollContainerHeight - scrollContainerTop - viewContainerHeight));
                if (scrollContainerHeight - scrollContainerTop - viewContainerHeight <= bottomDistance) {
                    me.loadNextPage();
                }
            }
            else
            {
                var viewContainerHeight     = viewContainer.offsetHeight;
                var scrollContainerHeight   = scrollContainer.scrollHeight || scrollContainer.offsetHeight;
                var scrollContainerTop      = viewContainer.scrollTop;
                // consoleHelper.logDebug('viewContainerHeight: ' + viewContainerHeight +
                //     ' scrollContainerHeight: ' + scrollContainerHeight +
                //     ' scrollContainerTop: ' + scrollContainerTop);

                // check current element is display
                if (!scrollContainerHeight) {
                    consoleHelper.logDebug('scroll container height: ' + scrollContainerHeight);
                    return;
                }

                // consoleHelper.logDebug('bottom distance: ' + (scrollContainerHeight - scrollContainerTop - viewContainerHeight));
                if (scrollContainerHeight - scrollContainerTop - viewContainerHeight <= bottomDistance) {
                    me.loadNextPage();
                }
            }
        },

        /**
         * add a output channel
         * @param  String  id
         * @param  Object  control
         */
        addOutput : function (id, control){
            if ( typeof(control) != 'object' )
            {
                consoleHelper.logError('add output error: ' + id + ' is not a object.');
                return;
            }
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
        }
    },
    mounted() {

        // init some third-part component.
        if (this.enableLottie)
        {
            this.initLottie();
        }

        if (this.enableDataList)        // initialization for data list
        {
            this.pagination.pageSize = this.pageSize;

            // bind event
            this.pagination.showSizeChange  = this.onChangeSize;
            this.pagination.change          = this.onChangePage;

            if (this.autoLoadDataList)
            {
                this.loadDataList();
            }

            if (this.scrollToLoadNextPage != false)
            {
                var viewContainer = this.getViewContainer();

                viewContainer ? viewContainer.addEventListener('scroll', this.onScroll) : null;
            }

        }

    }

};
