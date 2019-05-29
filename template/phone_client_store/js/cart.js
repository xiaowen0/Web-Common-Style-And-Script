moment.locale('zh-cn');

// app.loadKefuIconPanel();

var baseUrl = '../../';

var cart = new Vue({
    el: '#infoItem',
    data: {
        url: baseUrl + 'data/cartData.json',
        trolleysUrl: baseUrl + 'portal/shop/product/updateProductCount',
        status: '',
        limit: 99999,
        pageCount: 1,
        totalCount: 0,
        itemInfo: []
    },
    methods: {
        init: function () {
            var me = this;
            this.loadPage();
        },
        loadPage: function () {
            var me = this;
            if (this.status === 'loading') {
                return;
            }
            this.status = 'loading';
            $.ajax({
                url: me.url,
                data: {
                    limit: me.limit
                },
                success: function (result) {
                    if (result.errorCode) {
                        app.showMessageBox(msg);
                        return;
                    }
                    for (var i = 0; i < result.data.length; i++) {
                        for (var b = 0; b < result.data[i].trolleysList.length; b++) {
                            result.data[i].trolleysList[b].checked = true
                        }
                    }
                    me.itemInfo = me.itemInfo.concat(result.data);

                },
                error: function () {
                    me.status = 'error';
                }
            });
        },
        getCountPrice: function () {
            for (var i = 0; i < result.data.length; i++) {
                me.itemInfo
            }

        },
        /**
         *
         * @param  Object  store  cart data
         * @param  Number  type
         * - 1: shop total
         * - 0: all total
         * @return  Number
         */
        getStorePrice: function (store, type) {
            var price = 0;
            var me = this;
            if (type) {
                for (var b = 0; b < store.trolleysList.length; b++) {
                    if (store.trolleysList[b].checked) {
                        var tPrice = store.trolleysList[b].productPrice;
                        var tCount = store.trolleysList[b].productCount;
                        price += tPrice * tCount;
                    }
                }
                return price;
            } else {
                var totle_price = 0;
                for (var i = 0; i < me.itemInfo.length; i++) {
                    for (var b = 0; b < me.itemInfo[i].trolleysList.length; b++) {
                        if (me.itemInfo[i].trolleysList[b].checked) {
                            var tPrice = me.itemInfo[i].trolleysList[b].productPrice;
                            var tCount = me.itemInfo[i].trolleysList[b].productCount;
                            totle_price += tPrice * tCount;
                        }
                    }
                }
                return totle_price
            }
        },
        checkAll: function (event) {
            var target = event.currentTarget;
            var id = target.dataset.storeid;
            var checked = target.checked;
            var me = this;
            for (var i = 0; i < me.itemInfo.length; i++) {
                if (me.itemInfo[i].id == id) {
                    for (var b = 0; b < me.itemInfo[i].trolleysList.length; b++) {
                        me.itemInfo[i].trolleysList[b].checked = checked;
                    }
                }
            }

        },
        doAddOrDe: function (event) {
            var target = event.currentTarget;
            var type = target.dataset.type;
            var id = target.dataset.productid;
            var me = this;
            var count = 0;
            for (var i = 0; i < me.itemInfo.length; i++) {
                // if (me.itemInfo[i].id == id) {
                    for (var b = 0; b < me.itemInfo[i].trolleysList.length; b++) {
                        if (me.itemInfo[i].trolleysList[b].productId == id) {
                            if (type==1) {
                                count = me.itemInfo[i].trolleysList[b].productCount + 1;
                                me.itemInfo[i].trolleysList[b].productCount=count
                            } else {
                                count = me.itemInfo[i].trolleysList[b].productCount - 1 ;
                                if(count<=0){
                                    app.showMessageBox("已经最小啦~")
                                    return
                                }
                                me.itemInfo[i].trolleysList[b].productCount=count
                            }
                        }
                        ;
                    }
            }
            $.ajax({
                url: me.trolleysUrl,
                data: {
                    productId: id,
                    count: count
                },
                type:'POST',
                success: function (result) {
                    if (result.errorCode) {
                        return;
                    }
                },
                error: function (result) {
                    app.showMessageBox(result.msg)
                }
            })
        },
        getAd: function () {
            $.ajax({
                url: Link.prefix.realmName + "portal/home/list_ad",
                data: {
                    typeValue:'7'
                },
                success: function (result) {
                    $("#js-ad-list").html(ejs.render($("#tp-ad-list").html(), result));
                    var slider = $('.swiper-container');
                    slider.swiper({
                        autoplay: 3000,
                        loop: true,
                        grabCursor: true,
                    });
                },
                error: function (result) {
                    app.showMessageBox(result.msg)
                }
            })

        },
        doOrder:function () {
            var me = this;
            var id=[];
            for (var i = 0; i < me.itemInfo.length; i++) {
                for (var b = 0; b < me.itemInfo[i].trolleysList.length; b++) {
                    if (me.itemInfo[i].trolleysList[b].checked) {
                        id.push(me.itemInfo[i].trolleysList[b].id);
                    }
                }
            }
            $.cookie('orderList', id);
            window.location.href = './order.html'
        }
        ,
        loadNextPage: function () {
            if (this.page >= this.pageCount) {
                return;
            }

            if (this.status === 'loading') {
                return;
            }

            this.page++;
            this.loadPage();
        }
    }
});

cart.init();

