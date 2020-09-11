moment.locale('zh-cn');

// var apiBaseUrl = Link.prefix.realmName;
var apiBaseUrl = '../../';
var pageConfig = {

    apiConfig : {
        list : {
            url : apiBaseUrl + 'data/addressList.json'
        }
    }
};

var addressBookContent = initVueTableList({
    el : '#addressBookContent',
    apiConfig : pageConfig.apiConfig,
    size : 100,
    data : {
        selectedId : '',
        addAddressData : {
            address: "",
            city: "",
            district: "",
            phone: "",
            province: "",
            userName: "",
            zipCode: ""
        },
        provinceList : [],
        cityList : [],
        districtList : []
    },
    methods : {
        onSelectAddressItem : function (event){
            var target = event.currentTarget;
            var id = target.dataset.id || '';
            this.selectedId = id;
            var addressItem = this.getAddressRecord(id);

            // return to order content
            $('#addressBookPage').hide();

            // $('input[name="addressId"]').val(id);

            if (!addressItem)
            {
                return;
            }

            // send data to order controller
            if (typeof(order) == 'undefined')
            {
                return;
            }
            order.addressData = addressItem;
        },
        getAddressRecord : function (id){
            return getObjectInListByKey(this.list, 'id', id);
        },
        onChangeProvince : function (event){
            var target = event.currentTarget;
            var value = target.value;

            var province = this.provinceList[value];
            this.cityList = province;
            this.districtList = [];
        },
        onChangeCity : function (event){
            var target = event.currentTarget;
            var value = target.value;

            var city = this.cityList[value];
            this.districtList = city;
        }
    },
    afterLoadData : function (result){

        if (result.errorCode)
        {
            app.showMessageBox(result.msg);
            return;
        }
        addressBookContent.list = result.data;

        if (!addressBookContent.selectedId)
        {
            for (var i=0; i<addressBookContent.list.length; i++)
            {
                if (addressBookContent.list[i].isDefault)
                {
                    addressBookContent.selectedId = addressBookContent.list[i].id;

                    // send data to order controller
                    if (typeof(order) != 'undefined')
                    {
                        order.addressData = addressBookContent.list[i];
                    }

                    break;
                }
            }
        }
    }
});

app.loadCityData(function(data, error){
    addressBookContent.provinceList = data;
});

