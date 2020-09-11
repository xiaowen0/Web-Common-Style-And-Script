/**
 * Created by wen on 2018/4/17.
 * module for edit information
 */

define(['vue', 'jquery'], function (Vue){

    var editSettingForm = new Vue({
        el : '#editSettingForm',
        data : {
            loadDataUrl : 'data/',
            updateDataUrl : 'data/'
        },
        methods : {
            loadInfo : function(){
                var me = this;
                $.ajax('data/hall_info.json', {
                    dataType : 'json',
                    success : function(result){
                        me.updateData(result);
                    }
                });
            },
            updateData : function(data){
                for (var name in data)
                {
                    this[name] = data[name];
                }
            },
            saveData : function(){
                var data = {

                };

                $.ajax(this.updateDataUrl, {
                    dataType : 'json',
                    type : 'post',
                    data : data,
                    success : function(result){
                    }
                });
            }
        }
    });

    editSettingForm.loadInfo();

});
