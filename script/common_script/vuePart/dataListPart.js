import axios from '@util/axios'
import moment from 'moment';
import consoleHelper from '@util/consoleHelper';
import objectHelper from '@util/objectHelper';

import arrayHelper from "../../util/arrayHelper";

export default {
    data() {
        return {

            /**
             * @var String
             * 'loading', 'ready', 'error'
             */
            status: '',

            errorInfo: {
                status: 0,
                message: ''
            },
            dataList: [],
            columns: [
                /*
                {
                    header: 'ID',
                    dataIndex: 'id',
                    width: '30%'
                }
                 */
            ],
            pageSize: 10,
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                totalPage: 1,
                showSizeChanger: true,
                showSizeChange: null,
                change: null
            },
            apiConfig: {
                /*
                list : {
                    url : '',
                    method : 'get', // default: get
                    params : {},
                    pageName : 'page',
                    pageSizeName : 'limit',
                    dataPath : 'data.rows',
                    totalPage : 'data.totalPage',
                }
                 */
            },
            filters: {
                /*
                name : '',
                status : '',
                createTime : ''
                 */
            },
            searchInputbox: {
                column: ''
            },
            autoLoadData: true, // set false to disable auto load data

            enableLottie : false,

            scrollControl: {
                viewContainer: window,
                scrollContainer: document.documentElement
            },

            scrollToLoadNextPage: 40,
            loadNextPageDelay: 500,

            /**
             * map to external controller, it can output some signals.
             */
            outputMap: {}

        }
    },
    computed: {
        app() {
            var app = window.app || this.$parent || null;
            return app;
        }
    },
    methods: {

        loadData: function () {

            if (this.status === 'loading') {
                return;
            }

            var me = this;

            // clone api extra params
            var data = objectHelper.clone(this.apiConfig.list.params || {});

            // add filter's params
            // data = objectHelper.merge(data, this.filters);
            for (var key in this.filters) {
                if (this.filters[key]) {
                    data[key] = this.filters[key];
                }
            }

            var pageName = this.apiConfig.list.pageName || 'page';
            var pageSizeName = this.apiConfig.list.pageSizeName || 'limit';

            var dataPath = this.apiConfig.list.dataPath || 'data.rows';
            var totalPath = this.apiConfig.list.totalPath || 'data.total';
            var totalPagePath = this.apiConfig.list.totalPagePath || 'data.totalPage';
            var dataColumnMapping = this.apiConfig.list.dataColumnMapping || {};

            // add page params
            data[pageName] = this.pagination.current;
            data[pageSizeName] = this.pagination.pageSize;

            // consoleHelper.logDebug('data:');
            // consoleHelper.logDebug(data);

            var url = this.apiConfig.list.url || '';
            var method = this.apiConfig.list.method || 'get';
            var params = this.apiConfig.list.params || {};
            params = objectHelper.merge(params, data);

            if (!url) {
                consoleHelper.logWarn('list api url not define, it can not load data.');
                return;
            }

            this.status = 'loading';
			this.onLoading ? this.onLoading() : null;

            var options = {
                url: url,
                method: method
            };
            if (method == 'get') {
                options.params = params;
            } else {
                options.data = params;
            }

            axios(options).then(res => {

                this.status = 'ready';
                var data = objectHelper.getDataByKeyPath(res.data, dataPath);
                var total = objectHelper.getDataByKeyPath(res.data, totalPath);
                var totalPage = objectHelper.getDataByKeyPath(res.data, totalPagePath);
                if (typeof (data) == 'undefined' || data == null) {
                    consoleHelper.logError('data is empty.');
                    return;
                }
                // debugger;
                data = objectHelper.listDataColumnConvert(data, dataColumnMapping);

                me.dataList = me.dataList.concat(data);
                me.pagination.total = total;
                me.pagination.totalPage = totalPage;

                if (this.onLoadData) {
                    this.onLoadData(data);
                }

            }).catch(error => {
                this.status = 'error';
				this.onError ? this.onError(error) : null;
                if (error.response) {
                    this.errorInfo.status = error.response.status;
                    var data = error.response.data;
                    this.errorInfo.message = data.message || '';
                } else {
                    // no response, It means time out or be deny by browser
                    this.errorInfo.status = -1;
                    this.errorInfo.message = '网络出错';
                }
            });
        },

        reloadData: function () {
            this.dataList = [];
            this.pagination.current = 1;
            this.loadData();
        },

        loadNextPage: function () {

            consoleHelper.logDebug('load next page.');
            if (this.status === 'loading') {
                consoleHelper.logDebug('current status is loading, return.');
                return;
            }

            if (this.pagination.current == this.pagination.totalPage) {
                consoleHelper.logDebug("It's already last page.");
                return;
            }

            this.pagination.current++;
            this.loadData();

            // this.status = 'loading';
            //
            // window.setTimeout(() => {
            //     this.pagination.current++;
            //     this.loadData();
            // }, this.loadNextPageDelay);

        },

        /*
         * methods for pagination
         */

        onChangePage: function (page, pageSize) {
            consoleHelper.logDebug('page=' + page);
            this.pagination.current = page;
            this.dataList = [];
            this.loadData();
        },
        onChangeSize: function (current, size) {
            consoleHelper.logDebug('size=' + size);
            this.pagination.current = 1;
            this.pagination.pageSize = size;
            this.dataList = [];
            this.loadData();
        },

        onLoadData: function () {},
		
		/* before load data, status: loading */
		onLoading : function () {},
		
		/* after load data fail, status: error
		 * @param	Object	error
		 */
		onError : function (error) {},
		
        afterRemove : function () {},
        onRemoveError : function () {},

        /**
         * add a output channel
         * @param  String  id
         * @param  Object  control
         */
        addOutput: function (id, control) {
            if (typeof (control) != 'object') {
                consoleHelper.logError('add output error: ' + id + ' is not a object.');
                return;
            }
            this.outputMap[id] = control;
        },

        /**
         * output signal
         * @param  Object  signal information
         */
        outputSignal: function (signal) {
            for (var key in this.outputMap) {
                if (typeof (this.outputMap[key].inputSignal) === 'undefined') {
                    consoleHelper.log('[warning] inputSignal method not exist in ' + key + ' output control.');
                    continue;
                }
                this.outputMap[key].inputSignal(signal);
            }
        },

        /*
         * methods for table
         */

        // pagination, filters, sorter, { currentDataSource })
        onTableChange: function (pagination) {

            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            this.dataList = [];
            this.loadData();
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

        formatDate: function (timestamp) {
            if (!timestamp) {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD');
        },
        formatDateTime: function (timestamp) {
            if (!timestamp) {
                return '';
            }
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        },

        formatDelayTime: function (timestamp) {
            if (!timestamp) {
                return '';
            }
            return moment(timestamp).fromNow();
        },

        /*
         * methods for search inputbox
         */

        onSearch: function (value) {
            if (this.searchInputbox.column === '') {
                consoleHelper.logWarn('searchInputbox column is empty.');
                return;
            }

            this.filters[this.searchInputbox.column] = value;
            this.dataList = [];
            this.loadData();
        },

        showSearchDialog: function () {
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

        // use in remove button, need data-id attribute.
        onRemove : function (event){

            var me = this;
            var target = event.currentTarget;
            var id = target.dataset.id || '';

            if (!window.confirm('确认要删除这些数据吗？（该操作不可逆）'))
            {
                return;
            }

            var url = this.apiConfig.remove.url || '';
            var method = this.apiConfig.remove.method || 'post';
            var params = this.apiConfig.remove.params || {};
            var idParamName = this.apiConfig.remove.idParamName || 'id';

            var options = {
                url : url,
                method : method,
                params : params,
            };
            options[idParamName] = id;
            axios(options).then(res => {

                var item = me.getItemById(id);
                me.list = arrayHelper.removeElement(me.list, item);

                if (this.afterRemove)
                {
                    this.afterRemove();
                }
            }).catch(this.onRemoveError);
        },

        onScroll : function(event) {

            var me = this;

            if (me.scrollToLoadNextPage == false) {
                return;
            }

            // check current element is display
            var eleHeight = me.$el.offsetHeight;
            if (!eleHeight) {
                return;
            }

            var bottomDistance = me.scrollToLoadNextPage;

            var viewContainer = this.getViewContainer();
            var scrollContainer = this.getScrollContainer();

            if (viewContainer == window)
            {
                var viewContainerHeight = viewContainer.innerHeight || viewContainer.offsetHeight;
                var scrollContainerHeight = scrollContainer.offsetHeight;
                var scrollContainerTop = scrollContainer.scrollTop;
                consoleHelper.logDebug('bottom distance: ' + scrollContainerHeight - scrollContainerTop - viewContainerHeight);
                if (scrollContainerHeight - scrollContainerTop - viewContainerHeight <= bottomDistance) {
                    me.loadNextPage();
                }
            }
            else
            {
                var viewContainerHeight     = viewContainer.offsetHeight;
                var scrollContainerHeight   = scrollContainer.scrollHeight || scrollContainer.offsetHeight;
                var scrollContainerTop      = viewContainer.scrollTop;
                consoleHelper.logDebug('bottom distance: ' + scrollContainerHeight - scrollContainerTop - viewContainerHeight);
                if (scrollContainerHeight - scrollContainerTop - viewContainerHeight <= bottomDistance) {
                    me.loadNextPage();
                }
            }
        }
    },
    mounted() {

        // init some third-part component.
        if (this.enableLottie)
        {
            this.initLottie();
        }

        this.pagination.pageSize = this.pageSize;

        // bind event
        this.pagination.showSizeChange = this.onChangeSize;
        this.pagination.change = this.onChangePage;

        if (this.autoLoadData) {
            this.loadData();
        }

        var me = this;

        if (this.scrollToLoadNextPage != false)
        {
            var viewContainer = this.getViewContainer();

            viewContainer ? viewContainer.addEventListener('scroll', me.onScroll) : null;
        }

    }

};
