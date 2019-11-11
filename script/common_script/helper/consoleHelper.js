var helper = {

    console : window.console || null,

    /**
     * log a message
     * @param   text    String
     * @returns boolean
     */
    log : function(text)
    {
        this.console ? this.console.log(text) : null;
    },

    /**
     * log a warn message
     * @param   text    String
     * @returns boolean
     */
    logWarn : function(text)
    {
        if (!this.console)
        {
            return;
        }

        if (typeof(this.console.warn) != 'undefined')
        {
            this.console.warn('[warn] ' + text);
        }
        else
        {
            this.console.log('[warn] ' + text);
        }
    },

    /**
     * log a error message
     * @param   text    String
     * @returns boolean
     */
    logError : function(text)
    {
        if (!this.console)
        {
            return;
        }

        if (typeof(this.console.warn) != 'undefined')
        {
            this.console.warn('[error] ' + text);
        }
        else
        {
            this.console.log('[error] ' + text);
        }
    },

    /**
     * get debug status
     * @returns boolean
     */
    getDebugStatus : function()
    {
        try {
            if (typeof(sessionStorage) != 'object') {
                return false;
            }
            // some browser may deny read storage
            return sessionStorage.getItem('debug') === 'on';
        }
        catch (e)
        {
            return false;
        }
    },

    /**
     * log a debug message, only in debug status.
     * @param   text    String
     * @returns boolean
     */
    logDebug : function(content)
    {
        if (!this.getDebugStatus())
        {
            return;
        }

        if (typeof (content) === 'string')
        {
            this.log('[debug] ' + content);
        }
        else
        {
            this.log(content);
        }
        return true;
    }

    // ,test : function (){
    //     this.log('debug status: ' + (this.getDebugStatus() ? 'on' : 'off'));
    //     this.log('this is a log.');
    //     this.logWarn('this is a warn log.');
    //     this.logError('this is a error log.');
    //     this.logDebug('this is a debug log.');
    // }
}

export default helper;
