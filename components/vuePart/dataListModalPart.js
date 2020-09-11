import dataListPart from './dataListPart'
export default {
    extends : dataListPart,
    data() {
        return {
            visible : false
        }
    },
    methods : {
        show : function () {
            this.visible = true;
        },
        hide : function () {
            this.visible = false;
        }
    }
};
