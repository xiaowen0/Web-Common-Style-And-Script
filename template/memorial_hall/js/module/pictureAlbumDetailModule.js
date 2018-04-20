/**
 * module for picture album detail
 */

define(['vue', 'jquery'], function (Vue){

    var pictureAlbumModule = new Vue({
        el : '#pictureAlbumDetailModule',
        data : {
            createPictureUrl : '',
            alterPictureUrl : '',
            deletePictureUrl : ''
        },
        methods : {
            uploadPicture : function(){
                openDialog('#uploadPictureDialog', {
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
            alterPicture : function(picture_id){
                console.log(picture_id);
                openDialog('#alterPictureDialog', {
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
            deletePicture : function(picture_id){
                console.log(picture_id);
                openDialog('#deletePictureDialog', {
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

