/**
 * Created by wen on 2018/4/17.
 * module for login form
 */

define(['vue', 'jquery'], function (Vue){

    var loginForm = new Vue({
        el : '#loginForm',
        data : {
            loginUrl : 'data/login.json',
            name : '',
            password : ''
        },
        methods : {
            submit : function(event){

                event.preventDefault();

                var data = {
                    name : this.name,
                    password : this.password
                };

                $.ajax(this.loginUrl, {
                    dataType : 'json',
                    type : 'post',
                    data : data,
                    success : function(result){
                    }
                });
            }
        }
    });

});
