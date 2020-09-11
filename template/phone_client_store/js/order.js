
var baseUrl = '../../';

var order = new Vue({
    el: '#infoItem',
    data: {
        url: baseUrl + 'portal/shop/product/trolleysList',
        status: '',
        orderInfo: {
            data : {
                supplierGroupVos : []
            }
        },
        id: [],
        userName : '',
        phone : '',
        address : '',
        addressData : {
            address: "",
            city: "",
            district: "",
            id: "",
            modifiedTime: 0,
            phone: "",
            province: "",
            userName: "",
            zipCode: ""
        },
        addressId : ''
    },
    methods: {
        init: function () {
            var me = this;
        },
        getOrderInfo: function () {
            var me = this;
            $.ajax({
                url: Link.prefix.realmName + "portal/shop/product/getProductListByIds",
                data: {
                    "trolleyIds":me.id
                },
                type:'POST',
                dataType: "json",
                success: function (result) {
                    console.log(result)
                    me.orderInfo = result
                },
                error: function (result) {
                    dialog.msg(result.msg)
                }
            })
        },
        onClickAddressBlock : function (){
            $('#addressBookPage').show();
        }
    }
})
window.order = order;
order.init();
