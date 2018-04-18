/**
 * Created by wen on 2018/4/17.
 * module for edit information
 */

define(['vue', 'jquery'], function (Vue){

    var editInfoForm = new Vue({
        el : '#editInfoForm',
        data : {
            loadDataUrl : 'data/hall_info.json',
            updateDataUrl : 'data/hall_info.json',
            name : '',
            birthday : '',
            passAwayDate : '',
            desc : ''
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
                    name : this.name,
                    birthday : this.birthday,
                    passAwayDate : this.passAwayDate,
                    desc : this.desc
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

    editInfoForm.loadInfo();

});
