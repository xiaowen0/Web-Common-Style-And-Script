import axios from '@util/axios'
import moment from 'moment';
import objectHelper from '@util/objectHelper';
import consoleHelper from '@util/consoleHelper';

export default {

    data () {
        return {
            status : '',
            errorInfo : {
                status : 0,
                message : ''
            },
            dataItem : {},
            categoryList : [],
            apiConfig : {
                get : {
                    url : '',
                    // method : 'get',              // default: get
                    params : {},                 // extra data
                    // pageName : 'page',           // default: page
                    // pageSizeName : 'limit',      // default: limit
                    // dataPath : 'data.records',      // default: data.rows
                    // dataColumnMapping : {
                    //     downloadCount : 'downCount'
                    // },
                    // totalPath : 'data.total',    // default: data.total
                    // totalPagePath : 'data.pages'    // default: data.totalPage
                },
                add : {
                    url : ''
                },
                update : {
                    url : ''
                },
                remove : {
                    url : ''
                }
            }
        }
    },
    methods : {

        reset : function () {
            for (var key in this.dataItem)
            {
                this.dataItem[key] = '';
            }
        },
        loadData : function (pk){
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

            this.status = 'loading';
            axios(options).then(res => {

                this.status = 'ready';

                var data        = objectHelper.getDataByKeyPath(res.data, dataPath);
                data = objectHelper.dataColumnConvert(data, this.apiConfig.get.dataColumnMapping || {});
                this.dataItem = data;

                if (this.onLoadData)
                {
                    this.onLoadData(this);
                }
            }).catch(error => {
                this.status = 'error';
                var data = error && error.response ? error.response.data : '';
                var message = data.message || '未知错误';
                window.app.showMessage('出错了', message);
            });
        },
        reloadData : function (){
            this.loadData(this.dataItem.id);
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
            }).catch(res => {
                if (callback) { callback(res, null) }
            });
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
                    this.$parent.reloadData();
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

        beforeSubmit : function (data) {
            return data;
        },

        /**
         * var null|funciton(responseData)
         */
        onSubmitSuccess : function () {},
        onSubmitError : function () {},
        onLoadData : function () {},

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
        }
    }
}
