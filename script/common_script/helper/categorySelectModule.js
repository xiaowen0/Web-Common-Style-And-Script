import 'vue'
import consoleHelper from './consoleHelper'
/**
 * category select module helper
 *
 * use helper.init(options) to init module
 * @param object options
 * - el (required)  String  ID CSS selector
 * - apiConfig (required)   Object
 * --- list (required)      Object  list api config
 * ----- url (required)
 * ----- method             String  method name, default: 'get'
 * ----- params             Object  extra params
 *
 * data :
 * list         Array   category list data
 * selectedId   Mixed
 *
 * method :
 * addOutput(id, control)   add a output controller for receive data for some action like select.
 *
 * event :
 * onSelect     category item event, element need data-id attribute
 */
var helper = {
    init : function (options){

        typeof (options) != 'object' ? options = {} : null;
        var el = options.el || '';
        var apiConfig = options.apiConfig || {};

        var control = new Vue({
            el : el,
            data : {
                apiConfig : apiConfig,
                categoryList : [],
                selectedId : '',
                outputMap : {}
            },
            methods : {
                init : function (){
                    this.loadList();
                },
                loadList : function (){
                    var me = this;
                    $.ajax({
                        url : me.apiConfig.list.url,
                        type : me.apiConfig.list.method || 'get',
                        data : me.apiConfig.list.params || {},
                        success : function (result){
                            me.categoryList = result.data;
                        }
                    });
                },
                /**
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
                            consoleHelper.logWarn('[warning] inputSignal method not exist in ' + key + ' output control.');
                            continue;
                        }
                        this.outputMap[key].inputSignal(signal);
                    }
                },
                onSelect : function (event) {
                    var target = event.currentTarget;
                    var id = target.dataset.id || '';
                    this.selectedId = id;
                    var signalMessage = {
                        type : 'selectCategory',
                        id : this.id
                    };
                    this.outputSignal(signalMessage);
                }
            },
            created : function (){
                this.init();
            }
        });

        return control;
    }
}

export default helper;

