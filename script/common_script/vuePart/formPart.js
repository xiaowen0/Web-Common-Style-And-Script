import objectHelper from '@util/objectHelper';
import consoleHelper from '@util/consoleHelper';
import axios from '@util/axios'

export default {
    data() {
        return {
            status : '',
            errorInfo : {
                status : 0,
                message : ''
            },
            formData : {},
            apiConfig : {
                submit : {
                    url : ''
                }
            }
        }
    },
    methods : {
        submit : function () {
            var options     = objectHelper.clone(this.apiConfig.submit);
            options.data    = this.formData;

            if (options.url == '')
            {
                consoleHelper.logWarn('submit url not defined.');
                return;
            }

            if (this.status === 'loading')
            {
                return;
            }

            this.status = 'loading';
            axios(options).then(res => {
                this.status = 'success';
            }).catch(error => {
                this.status = 'error';

                this.errorInfo.status = error.status;
                this.errorInfo.message = error.statusText;
            })
        }
    }
};
