import dataItemPart from './dataItemPart'
export default {
    extends : dataItemPart,
    data() {
        return {
            visible : false
        }
    },
    methods : {
        open : function () {
            this.visible = true;
        },
        close : function () {
            this.visible = false;
        }
    }
};
