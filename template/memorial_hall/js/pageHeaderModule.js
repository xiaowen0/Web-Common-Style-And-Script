/**
 * Created by wen on 2018/4/9.
 */

define(['vue', 'jquery'], function (Vue){
    var pageHeaderModule = new Vue({
        el: '#pageHeader',
        data: {
            nameEditingState : false,
            name: '',
            nameDraft : '',
            editable : false
        },
        methods : {
            init : function(){
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
            preventDefault : function(event){
                event.preventDefault();
            },
            editName : function(event){
                if (!this.editable)
                {
                    return;
                }
                this.nameDraft = this.name;
                this.nameEditingState = true;
            },
            saveNewName : function(){
                this.name = this.nameDraft;
                this.nameEditingState = false;
            },
            cancelEditName : function(){
                this.nameEditingState = false;
            }
        }
    });

    pageHeaderModule.init();
});


