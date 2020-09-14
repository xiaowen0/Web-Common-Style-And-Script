'use strict';

const animationFunctionEnum = {
    linearTween : function (t, b, c, d) {
        return c*t/d + b;
    },
    easeInQuad : function (t, b, c, d) {
        t /= d;
        return c*t*t + b;
    },
    easeOutQuad : function (t, b, c, d) {
        t /= d;
        return -c * t*(t-2) + b;
    },
    easeInOutQuad : function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    },
    easeInCubic : function (t, b, c, d) {
        t /= d;
        return c*t*t*t + b;
    },
    easeOutCubic : function (t, b, c, d) {
        t /= d;
        t--;
        return c*(t*t*t + 1) + b;
    },
    easeInOutCubic : function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    },
    easeInQuart : function (t, b, c, d) {
        t /= d;
        return c*t*t*t*t + b;
    },
    easeOutQuart : function (t, b, c, d) {
        t /= d;
        t--;
        return -c * (t*t*t*t - 1) + b;
    },
    easeInOutQuart : function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t + b;
        t -= 2;
        return -c/2 * (t*t*t*t - 2) + b;
    },
    easeInQuint : function (t, b, c, d) {
        t /= d;
        return c*t*t*t*t*t + b;
    },
    easeOutQuint : function (t, b, c, d) {
        t /= d;
        t--;
        return c*(t*t*t*t*t + 1) + b;
    },
    easeInOutQuint : function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t*t*t + 2) + b;
    },
    easeInSine : function (t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine : function (t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInExpo : function (t, b, c, d) {
        return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
    },
    easeOutExpo : function (t, b, c, d) {
        return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
    },
    easeInOutExpo : function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
        t--;
        return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
    },
    easeInCirc : function (t, b, c, d) {
        t /= d;
        return -c * (Math.sqrt(1 - t*t) - 1) + b;
    },
    easeOutCirc : function (t, b, c, d) {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t*t) + b;
    },
    easeInOutCirc : function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        t -= 2;
        return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    }
};

function initAnimate() {

    var easingFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (t, b, c, d) {
        return c * t / d + b;
    };

    return function (duration, from, to, animFunc, callback) {
        var end_time = Number(new Date()) + duration;

        var getProgress = function getProgress() {
            var time_passed = end_time - +new Date();
            var change = from - to;

            return easingFunction(time_passed, to, change, duration);
        };

        var move = function move() {
            if (end_time > +new Date()) {
                animFunc(getProgress());
                requestAnimationFrame(move);
            } else {
                animFunc(to);

                if (typeof callback === 'function') {
                    callback(to);
                }
                return;
            }
        };

        move();
    };
}

export default {

    easingList : animationFunctionEnum,

    initAnimate : initAnimate,

    /**
     * @param   Object  options
     * - String  easing
     * - Number  duration       duration time (s), default 1
     * - Number  from           default 0
     * - Number  to             default 100
     * - Function    step       runs on each frame with a value as per easing function
     * --- value Number
     * - Function    callback   callback runs at the end of animation
     * --- value Number
     * @return {boolean}
     */
    animate(options = {}) {

        var easing      = options.easing || '';
        var duration    = options.duration || 1 * 1000;
        var from        = options.from || 0;
        var to          = options.to;
        var step        = options.step || null;
        var callback    = options.callback || null;

        var func = typeof (animationFunctionEnum[easing]) !== 'undefined' ?
            animationFunctionEnum[easing] : animationFunctionEnum['easeInQuad'];

        initAnimate(func)(duration, from, to, step, callback);
        return true;
    }
}
