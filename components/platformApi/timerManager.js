
var manager = {

    name : 'timerManager',

    /**
     * @param   Function    stepFunc
     * @param   Number      delay (millisecond)
     * @return  Number      timer id
     */
    setInterval : function (stepFunc, delay) {},

    /**
     * @param   Number  timer instance id
     */
    clearInterval : function (timerId) {},

    /**
     * @param   Function    stepFunc
     * @param   Number      delay (millisecond)
     * @return  Number      timer id
     */
    setTimeout : function (stepFunc, delay) {},

    /**
     * @param   Number  timer instance id
     */
    clearTimeout : function (timerId) {}

};

if (typeof(navigator) !== 'undefined')  // browser platform
{
    manager.setInterval = function (stepFunc, delay) {
        window.setInterval(stepFunc, delay);
    };

    manager.clearInterval = function (timerId) {
        window.clearInterval(timerId);
    };

    manager.setTimeout = function (stepFunc, delay) {
        window.setTimeout(stepFunc, delay);
    };

    manager.clearTimeout = function (timerId) {
        window.clearTimeout(timerId);
    };
}

else if ( typeof(setInterval) == 'function' )    // wechat mini program platform
{
    manager.setInterval = function (stepFunc, delay) {
        setInterval(stepFunc, delay);
    };

    manager.clearInterval = function (timerId) {
        clearInterval(timerId);
    };

    manager.setTimeout = function (stepFunc, delay) {
        setTimeout(stepFunc, delay);
    };

    manager.clearTimeout = function (timerId) {
        clearTimeout(timerId);
    };
}

export default manager;
