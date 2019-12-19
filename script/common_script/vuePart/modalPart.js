export default {
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
