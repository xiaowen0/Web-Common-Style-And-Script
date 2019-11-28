import domHelper from './domHelper'
import consoleHelper from './consoleHelper'

/**
 * some special handle for object
 */

var helper = {

    /**
     * update object's properties
     * @param   Object  object
     * @param   Object  data    new properties
     */
    updateData : function(object, data)
    {
        for (var key in data)
        {
            object[key] = data[key];
        }
    },

    /**
     * print object info to page.
     * @param object  Object
     * @requires    domHelper
     */
    printData : function(object)
    {
        var info = domHelper.createElement('div');
        var list = domHelper.createElement('ul');

        for (var name in object)
        {
            var property = domHelper.createElement('li');
            property.innerHTML   = name + ': ' + object[name];
            list.appendChild(property);
        }

        info.appendChild(list);
        document.body.appendChild(info);
    },

    /**
     * clone object
     * @param   Object  object
     * @return  Object
     */
    clone : function(object)
    {
        var newObject = new Object();

        for (var name in object)
        {
            newObject[name] = object[name];
        }

        return newObject;
    },

    /**
     * merge 2 object to a new object
     * @param   Object  obj1
     * @param   Object  obj2
     * @return  Object
     */
    merge : function(obj1, obj2)
    {
        var newObject = new Object();

        var name;
        for (name in obj1)
        {
            newObject[name] = obj1[name];
        }
        for (name in obj2)
        {
            newObject[name] = obj2[name];
        }

        return newObject;
    },

    /**
     * get object property by key path, it can visit deep property.
     * @example getObjectPropertyByKeyPath(product, 'category.name')
     * @param   Object          object
     * @param   String|Array    path
     * @requires    consoleHelper
     */
    getDataByKeyPath : function(object, path)
    {
        if (path === '')
        {
            consoleHelper.logError('path can not be a empty string.');
            return null;
        }
        var pathQueue = typeof(path) === 'string' ? path.split('.') : path;
        if (typeof(object[pathQueue[0]]) === 'undefined')
        {
            return null;
        }

        var property = object[pathQueue[0]];
        pathQueue.shift();

        if (pathQueue.length)
        {
            return this.getDataByKeyPath(property, pathQueue);
        }

        return property;
    },

    /**
     * set object property by key path, it can set deep property.
     * @example setObjectPropertyByKeyPath(product, 'category.name', 'cat')
     * @param   Object  object
     * @param   String  path
     * @param   *       value
     * @requires    consoleHelper
     */
    setDataByKeyPath : function(object, path, value)
    {
        if (path === '')
        {
            consoleHelper.logError('path can not be a empty string.');
            return null;
        }

        var pathQueue = path.split('.');

        var t = null;
        var tNode = object;

        // loop into next level
        for (var i=0; i<pathQueue.length; i++)
        {
            var tKey = pathQueue[i];

            // not leaf node, it must a object
            if (i+1 < pathQueue.length)
            {
                // not a object, then create one.
                if ( typeof (tNode[tKey]) === 'undefined' )
                {
                    tNode[tKey] = {};
                }

                // point to next level
                tNode = tNode[tKey];
            }
            else    // leaf node, set value
            {
                tNode[tKey] = value;
            }
        }
    }
};

export default helper;