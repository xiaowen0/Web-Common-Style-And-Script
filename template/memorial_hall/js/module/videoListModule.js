/**
 * module for picture album list
 */

define(['vue', 'jquery'], function (Vue){

    var videoListModule = new Vue({
        el : '#videoListModule',
        data : {
            uploadVideoUrl : '',
            alterVideoUrl : '',
            deleteVideoUrl : ''
        },
        methods : {
            uploadVideo : function(){
                openDialog('#uploadVideoDialog', {
                    onConfirm : function(dialog, form){
                        console.log('confirm');
                        closeDialog(dialog);
                        // console.log(form);
                    },
                    onCancel : function(dialog){
                        console.log('cancel');
                        closeDialog(dialog);
                    }

                });
            },
            alterVideo : function(video_id){
                console.log(video_id);
                openDialog('#alterVideoDialog', {
                    onConfirm : function(dialog, form){
                        console.log('confirm');
                        closeDialog(dialog);
                        // console.log(form);
                    },
                    onCancel : function(dialog){
                        console.log('cancel');
                        closeDialog(dialog);
                    }
                });
            },
            deleteVideo : function(video_id){
                console.log(video_id);
                openDialog('#deleteVideoDialog', {
                    onConfirm : function(dialog, form){
                        console.log('confirm');
                        closeDialog(dialog);
                        // console.log(form);
                    },
                    onCancel : function(dialog){
                        console.log('cancel');
                        closeDialog(dialog);
                    }
                });
            }
        }
    });

});

