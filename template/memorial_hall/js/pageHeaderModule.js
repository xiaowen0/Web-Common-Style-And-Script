/**
 * Created by wen on 2018/4/9.
 */

define(['vue', 'jquery'], function (Vue){
    var pageHeaderModule = new Vue({
        el: '#pageHeader',
        data: {
            titleEditingState : false,
            title: '',
            titleDraft : '',
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
            editTitle : function(event){
                if (!this.editable)
                {
                    return;
                }
                this.titleDraft = this.title;
                this.titleEditingState = true;
            },
            saveNewTitle : function(){
                this.title = this.titleDraft;
                this.titleEditingState = false;
            },
            cancelEditTitle : function(){
                this.titleEditingState = false;
            }
        }
    });

    pageHeaderModule.init();
});


