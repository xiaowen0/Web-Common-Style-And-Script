import formPart from './formPart'

export default {
    extends : formPart,
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
