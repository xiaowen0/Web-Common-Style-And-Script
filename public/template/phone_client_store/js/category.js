/**
 * controller for product category content page
 */

var categoryPageConfig = {
    apiConfig : {
        list : {
            url : 'data/product_list.json'
        },
        adList : {
            url : 'data/ad_list.json'
        }
    }
};

var productCategoryContent = new Vue({
    el: '#productCategoryContent',
    data: {
        url: categoryPageConfig.apiConfig.list.url,
        status: '',
        page: 1,
        pageCount: 1,
        totalCount: 0,
        productList: [],
        orderingStatus : 'default_0',
        priceOrderingDir : 1
    },
    methods: {
        init: function () {
            var me = this;
            me.loadPage();
            initLoadMore({}, function () {
                me.loadNextPage();
            });
        },
        getAd: function () {
            $.ajax({
                url: categoryPageConfig.apiConfig.adList.url,
                data: {
                    // typeValue:'7'
                },
                success: function (result) {

                },
                error: function (result) {
                    dialog.msg(result.msg)
                }
            })
        },
        loadPage: function () {
            var me = this;

            if (this.status === 'loading') {
                return;
            }

            this.status = 'loading';

            var orderStatus = '';
            if (this.orderingStatus == 'default_0')
            {
                orderStatus = 'SORT_ASC';
            }
            else if (this.orderingStatus == 'sales_1')
            {
                orderStatus = 'SALES_VOLUME';
            }
            else if (this.orderingStatus == 'price_')
            {
                orderStatus = 'PRICE_ASC';
            }
            else if (this.orderingStatus == 'score_1')
            {
                orderStatus = '';
            }
            else if (this.orderingStatus == 'time_1')
            {
                orderStatus = 'CREATE_TIME_ASC';
            }

            $.ajax({
                url: me.url,
                data: {
                    page: me.page,
                    orderStatus : orderStatus
                },
                success: function (result) {
                    if (result.errorCode) {
                        dialog.msg(msg);
                        return;
                    }

                    me.productList = me.productList.concat(result.data.rows);
                    me.pageCount = result.data.totalPage;
                    me.totalCount = result.data.totalCount;

                    me.status = 'ready';
                },
                error: function () {
                    me.status = 'error';
                }
            });
        },
        loadNextPage: function () {
            if (this.page >= this.pageCount) {
                return;
            }

            if (this.status === 'loading') {
                return;
            }

            this.page++;
            this.loadPage();
        },
        onChangeOrderingOption : function (event){
            var target = event.currentTarget;
            var status = target.dataset.status;

            // check dir and update control
            if (this.orderingStatus == status)  // current status, change direction
            {
                if (status == 'price_')
                {
                    this.priceOrderingDir ? this.priceOrderingDir = 0 : this.priceOrderingDir = 1;
                }
            }
            this.orderingStatus = status;

            this.page = 1;
            this.productList = [];
            this.loadPage();
        }
    }
});

productCategoryContent.init();

