export default {

    /**
     * clone array
     * @param Array array
     * @returns Array
     */
    clone : function(array)
    {
        var newArray = new Array();

        for (var index in array)
        {
            newArray[index] = typeof(array[index]) == "object" ? this.clone(array[index]) : array[index];
        }

        return newArray;
    },

    /**
     * check if a value in array  检查数组是否存在某个值
     * @param mixed  value
     * @param Array  array data
     * @returns boolean
     */
    existElement : function(value, array)
    {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    },

    /**
     * alias name for existElement
     */
    existItem : function(value, array)
    {
        return this.existElement(value, array);
    },

    /**
     * get array index by element in a array
     * @param  Array  array
     * @param  Mixed  element
     * @return Number  if not found, then return -1
     */
    getIndex : function(array, element)
    {
        for (var i = 0; i<array.length; i++)
        {
            if (array[i] === element)
            {
                return i;
            }
        }
        return -1;
    },

    /**
     * remove an element from a array, return a new array.
     * @param  Array  array
     * @param  Mixed  element
     * @returns {Array}
     */
    removeElement : function(array, element)
    {
        var newArray = new Array();

        for (var i=0; i<array.length; i++)
        {
            if (array[i] == element)
            {
                continue;
            }

            newArray.push(array[i]);
        }

        return newArray;
    },

    /**
     * alias name for removeElement
     */
    removeItem : function(array, element)
    {
        return this.removeElement(array, element);
    },

    /**
     * get item in a list by id
     * @param  Array  list
     * @param  String  id
     * @return {null|*}
     */
    getItemById : function(list, id)
    {
        for (var i=0; i<list.length; i++)
        {
            if (list[i].id === id)
            {
                return list[i];
            }
        }
        return null;
    },

    /**
     * get item in a list by column
     * @param  Array  list
     * @param  String  columnName
     * @param  String  value
     * @return {null|Object}
     */
    getItemByColumn : function(list, columnName, value) {
        for (var i=0; i<list.length; i++)
        {
            if (list[i][columnName] === value)
            {
                return list[i];
            }
        }

        return null;
    }

};
