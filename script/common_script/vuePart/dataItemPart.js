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
            apiConfig : {
                get : {
                    url : '',
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
            },
            beforeSubmit : null,
            onSubmitSuccess : null
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

            var data = {};
            data[idParam] = pk;

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
                let data        = objectHelper.getDataByKeyPath(res.data, dataPath);
                this.dataItem = data;

                this.status = 'ready';
            }).catch(res => {
                this.status = 'error';
                this.$message.error(res.data.msg);
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

        save : function (){

            var apiUrl      = this.dataItem.id ? this.apiConfig.update.url : this.apiConfig.add.url;
            var apiMethod   = this.dataItem.id ?
                this.apiConfig.update.method || '' : this.apiConfig.add.method || '';
            var dataPath    = this.dataItem.id ?
                this.apiConfig.update.dataPath || 'data' : this.apiConfig.add.dataPath || 'data';

            var data = objectHelper.clone(this.dataItem);
            // for (var key in columnsMapping)
            // {
            //     var apiKey = columnsMapping[key];
            //     data[apiKey] = data[key];
            //     delete data[key];
            // }

            if (this.beforeSubmit)
            {
                data = this.beforeSubmit(data);
                // check data, allow prevent submit.
                if (!data)
                {
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
                    this.onSubmitSuccess(res.data);
                }

                this.$success({
                    content : '保存成功'
                });

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

                if (this.$parent)
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
        }
    }
}
