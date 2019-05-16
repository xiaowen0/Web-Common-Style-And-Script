/**
 * controller for product category content page
 */

var productCategoryContent = new Vue({
    el: '#productCategoryContent',
    data: {
        //url: Link.prefix.realmName + 'portal/shop/product/list',
        url : 'data/product_list.json',
        status : '',
        page: 1,
        pageCount: 1,
        totalCount : 0,
        productList: []
    },
    methods: {
        init: function() {
            var me = this;
            me.loadPage();

            initLoadMore({}, function(){
                me.loadNextPage();
            });
        },
        loadPage: function() {
            var me = this;

            if (this.status === 'loading')
            {
                return;
            }

            this.status = 'loading';

            $.ajax({
                url : me.url,
                data : {
                    page : me.page
                },
                success : function (result){
                    if (result.errorCode)
                    {
                        dialog.msg(msg);
                        return;
                    }

                    me.productList = me.productList.concat(result.data.rows);
                    me.pageCount = result.data.totalPage;
                    me.totalCount = result.data.totalCount;

                    me.status = 'ready';
                },
                error : function (){
                    me.status = 'error';
                }
            });
        },
        loadNextPage : function (){
            if (this.page >= this.pageCount)
            {
                return;
            }

            if (this.status === 'loading')
            {
                return;
            }

            this.page++;
            this.loadPage();
        }
    }
});

productCategoryContent.init();

