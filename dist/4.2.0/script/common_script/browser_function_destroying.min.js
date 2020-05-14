/**
 * disable user copy action
 * @returns boolean
 */
function disableCopy()
{
    if (typeof(document.oncopy) === "undefined")
    {
        return false;
    }

    document.oncopy = (function (e)
    {
        return false;
    });

    return true;
}

/**
 * disable right-click context menu
 * @return boolean
 */
function disableContextMenu()
{
    if (typeof(document.oncontextmenu) === "undefined") {
        return false;
    }

    document.oncontextmenu = (function ()
    {
        return false;
    });
    return true;
}

/**
 * disable Ctrl+C hotkey
 * @returns boolean
 */
function disableCtrlC()
{
    try {
        var onkeydown = (function (e)
        {
            // keyCode with C key: 67
            if (e.ctrlKey && (e.keyCode == 67)) {
                return false;
            }
        });

        if (document.addEventListener) {  //所有主流浏览器，除了 IE 8 及更早 IE版本
            document.addEventListener("keydown", onkeydown);
            return true;
        }
        else if (document.attachEvent) {                  // IE 8 or older
            document.attachEvent("keydown", onkeydown);
            return true;
        }

        return false;
    }
    catch (e) {
        ;
    }
    return false;
}
