import axios from '@util/axios'
import moment from 'moment';
import consoleHelper from '@util/consoleHelper';
import objectHelper from '@util/objectHelper';

export default {
    data () {
        return {

            /**
             * @var String
             * 'loading', 'ready', 'error'
             */
            status : '',

            errorInfo : {
                status : 0,
                message : ''
            },
            dataList : [],
            columns : [
                /*
                {
                    header: 'ID',
                    dataIndex: 'id',
                    width: '30%'
                }
                 */
            ],
            pagination : {
                current : 1,
                pageSize : 10,
                total : 0,
                totalPage : 1,
                showSizeChanger : true,
                showSizeChange : null,
                change : null
            },
            apiConfig : {
                /*
                list : {
                    url : '',
                    method : 'get',
                    params : {},
                    pageName : 'page',
                    pageSizeName : 'limit',
                    dataPath : 'data.rows',
                    totalPage : 'data.totalPage',
                }
                 */
            },
            filters : {
                /*
                name : '',
                status : '',
                createTime : ''
                 */
            },
            searchInputbox : {
                column : ''
            },
            autoLoadData : true, // set false to disable auto load data

            scrollToLoadNextPage : 40,
            loadNextPageDelay : 500,

            /**
             * map to external controller, it can output some signals.
             */
            outputMap : {}

        }
    },
    methods : {

        loadData: function () {

            if (this.status === 'loading')
            {
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
            var totalPagePath   = this.apiConfig.list.totalPage || 'data.totalPage';
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

            axios(options).then(res => {

                this.status = 'ready';
                var data        = objectHelper.getDataByKeyPath(res.data, dataPath);
                var total       = objectHelper.getDataByKeyPath(res.data, totalPath);
                var totalPage   = objectHelper.getDataByKeyPath(res.data, totalPagePath);
                if (typeof(data) == 'undefined' || data == null)
                {
                    consoleHelper.logError('data is empty.');
                    return;
                }
                data = objectHelper.listDataColumnConvert(data, dataColumnMapping);
                me.dataList             = me.dataList.concat(data);
                me.pagination.total     = total;
                me.pagination.totalPage = totalPage;
            }).catch(error => {
                this.status = 'error';
                if (error.response)
                {
                    this.errorInfo.status = error.response.status;
                    var data = error.response.data;
                    this.errorInfo.message = data.message || '';
                }
                else
                {
                    // no response, It means time out or be deny by browser
                    this.errorInfo.status = -1;
                    this.errorInfo.message = '网络出错';
                }
            });
        },

        reloadData : function (){
            this.dataList = [];
            this.pagination.current = 1;
            this.loadData();
        },

        loadNextPage : function () {
            if (this.status === 'loading')
            {
                return;
            }

            if (this.pagination.current == this.pagination.totalPage)
            {
                return;
            }

            window.setTimeout(() => {
                this.pagination.current++;
                this.loadData();
            }, this.loadNextPageDelay);

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
            this.loadData();
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
         * methods for search inputbox
         */

        onSearch : function (value){
            if (this.searchInputbox.column === '')
            {
                consoleHelper.logWarn('searchInputbox column is empty.');
                return;
            }

            this.filters[this.searchInputbox.column] = value;
            this.dataList = [];
            this.loadData();
        }
    },
    mounted() {

        // bind event
        this.pagination.showSizeChange  = this.onChangeSize;
        this.pagination.change          = this.onChangePage;

        if (this.autoLoadData)
        {
            this.loadData();
        }

        window.addEventListener('scroll', () => {

            if (this.scrollToLoadNextPage == false)
            {
                return;
            }

            var bottomDistance = this.scrollToLoadNextPage;
            var windowHeight = window.innerHeight;
            var documentHeight = document.documentElement.offsetHeight;
            var scrollTop = document.documentElement.scrollTop;
            consoleHelper.logDebug('bottom distance: ' + documentHeight - scrollTop - windowHeight);
            if (documentHeight - scrollTop - windowHeight <= bottomDistance) {
                this.loadNextPage();
            }

        });

    }

};
