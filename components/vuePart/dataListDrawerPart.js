import dataListPart from './dataListPart'
export default {
    extends : dataListPart,
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
