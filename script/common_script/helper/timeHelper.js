import moment from 'moment';

export default {

    /**
     * format timestamp data to date text: 'YYYY-MM-DD'
     * @param   Number  timestamp
     * @return  String
     */
    formatDate : function (timestamp) {
        if (!timestamp)
        {
            return '';
        }
        return moment(timestamp).format('YYYY-MM-DD');
    },

    /**
     * format timestamp data to datetime text: 'YYYY-MM-DD HH:mm:ss'
     * @param   Number  timestamp
     * @return  String
     */
    formatDateTime : function (timestamp) {
        if (!timestamp)
        {
            return '';
        }
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    },

    /**
     * format timestamp data to delay text: 'before n minutes', 'before n days'
     * @param   Number  timestamp
     * @return  String
     */
    formatDelayTime : function (timestamp) {
        if (!timestamp)
        {
            return '';
        }
        return moment(timestamp).fromNow();
    }
};

