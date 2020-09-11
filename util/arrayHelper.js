import objectHelper from './objectHelper';

export default {

    /**
     * clone array
     * @param Array array
     * @returns Array
     */
    clone : function(array)
    {
        var newArray = new Array();

        for (var i=0; i<array.length; i++)
        {
            var tVal = array[i];

            if (typeof (tVal) != 'object')
            {
                newArray[i] = tVal;
            }
            else    // 对象、数组、null的 typeof 都返回 object，但是克隆方式不同。
            {
                if (tVal === null)
                {
                    newArray[i] = tVal;
                }
                else if (typeof (tVal.length) != 'undefined')
                {
                    newArray[i] = this.clone(tVal);
                }
                else
                {
                    newArray[i] = objectHelper.clone(tVal);
                }
            }
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
    },

    /**
     * get random item in array
     * @param   Array   list
     * @return  Mixed
     */
    getRandomItem : function (list) {
        var i = Math.floor( Math.random() * list.length );
        return list[i];
    },

    /**
     * move a element in a array
     * @param   Array   list
     * @param   Number  fromIndex
     * @param   Number  toIndex
     * @return  Array
     */
    moveItem : function (list, fromIndex, toIndex) {

        var moveingItem = list[fromIndex];

        if (toIndex >= list.length)  // out of array range
        {
            toIndex = list.length - 1;
        }

        var i = 0;
        // move from head to back
        if(toIndex > fromIndex)
        {
            for (i=fromIndex; i<toIndex; i++)   // start from head, each element move a place to head.
            {
                list[i] = list[i+1];
            }
        }
        // move from back to head
        else if (toIndex < fromIndex)
        {
            for (i=fromIndex; i>toIndex; i--)   // start from back, each element move a place to back
            {
                list[i] = list[i-1];
            }
        }

        list[toIndex] = moveingItem;

        return list;
    },

    unique : function(arr) {
        return arr.filter(function(e,i){
            return arr.indexOf(e)===i;
        });
    }

};
