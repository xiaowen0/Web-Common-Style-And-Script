/**
 * module for picture album list
 */

define(['vue', 'jquery'], function (Vue){

    var pictureAlbumModule = new Vue({
        el : '#pictureAlbumModule',
        data : {
            createAlbumUrl : '',
        },
        methods : {
            createAlbum : function(){
                openDialog('#createAlbumDialog', {
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
            alterAlbum : function(){

            },
            deleteAlbum : function(){

            }
        }
    });

});

