import enumPart from './enumPart';

// util
import objectHelper from '@util/objectHelper';

var couponTypeEnum = objectHelper.merge(enumPart, {

    FULL_REDUCTION: {
        code: 1,
        title: '满减'
    },
    STAND_BY: {
        code: 2,
        title: '减免'
    },
    DISCOUNT: {
        code: 3,
        title: '打折'
    }

});

export default couponTypeEnum;
