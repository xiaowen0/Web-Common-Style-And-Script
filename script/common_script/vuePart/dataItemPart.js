import axios from '@util/axios'
import moment from 'moment';
import objectHelper from '@util/objectHelper';

export default {

    data () {
        return {
            status : '',
            errorInfo : {
                status : 0,
                message : ''
            },
            dataItem : {}
        }
    },
    methods : {

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
    }
}
