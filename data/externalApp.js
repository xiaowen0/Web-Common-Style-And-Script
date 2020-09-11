// @var String   production | test | development
var mode = '';

if (process.env.NODE_ENV === 'production') {
    if (process.env.VUE_APP_MODE === 'prod') { // prod 正式环境
        //production 生产环境
        mode = 'prod';
    } else if (process.env.VUE_APP_MODE === 'test') { // test 测试环境
        mode = 'test';
    }
} else if (process.env.NODE_ENV === 'development') { //dev 开发环境
    // development 开发环境
    mode = 'development';
}

export default {

    oldShixun : {
        baseUrl : (function(){
            switch (mode)
            {
                case 'development' :
                    // return 'http://localhost:3001/dev/shixun-mobile/';
                    return 'http://h5.shixun365.com/shixun-mobile/';
                case 'test' :
                    return 'http://h5.shixun365.com/shixun-mobile/';
                case 'prod' :
                    return 'http://yj.shixun365.com/shixun-mobile/';
            }
            return '';
        })()
    }
};
