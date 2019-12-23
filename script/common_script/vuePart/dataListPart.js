import axios from '@util/axios'
import moment from 'moment';
import consoleHelper from '@util/consoleHelper';
import objectHelper from '@util/objectHelper';

export default {
    data () {
        return {
            // declare message with an empty value
            // refer: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties
            // message: '',

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
            autoLoadData : true // set false to disable auto load data

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
            data = objectHelper.merge(data, this.filters);

            var pageName        = this.apiConfig.list.pageName || 'page';
            var pageSizeName    = this.apiConfig.list.pageSizeName || 'limit';

            var dataPath        = this.apiConfig.list.dataPath || 'data.rows';
            var totalPath       = this.apiConfig.list.totalPath || 'data.total';
            var totalPagePath   = this.apiConfig.list.totalPage || 'data.totalPage';

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

            this.status = 'loading';

            axios(options).then(res => {
                let data        = objectHelper.getDataByKeyPath(res.data, dataPath);
                let total       = objectHelper.getDataByKeyPath(res.data, totalPath);
                let totalPage   = objectHelper.getDataByKeyPath(res.data, totalPagePath);
                me.dataList = me.dataList.concat(data);
                me.pagination.total     = total;
                me.pagination.totalPage = totalPage;

                this.status = 'ready';
            }).catch(res => {
                this.status = 'error';
                this.errorInfo.status = res.status;
                this.errorInfo.message = res.data.msg;
            });
        },

        reloadData : function (){
            this.dataList = [];
            this.loadData();
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

    }

};
