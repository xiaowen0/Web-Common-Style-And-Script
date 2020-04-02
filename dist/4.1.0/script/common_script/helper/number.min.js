/**
 * helper for number processing and calculate
 */
export default {

    fixFloatingPointNumber : function(number, bit)
    {
        var numberStr = new String(number);
        if (numberStr.indexOf('.') < 0) // no point, fill 0
        {
            return numberStr + '.' + repeatString('0', bit);
        }

        var a1 = numberStr.split('.');  a1[1].length;

        if (a1[1].length < bit)
        {
            a1[1] += repeatString('0', bit - a1[1].length);
        }
        else if (a1[1].length > bit)
        {
            a1[1] = a1[1].substr(0, bit);
        }

        return a1.join('.');
    },

    /**
     * random generate a integer number
     * @param  Number  length
     * @return Number
     */
    getRandomInteger : function(length)
    {
        return (Math.floor(Math.random() * length));
    },

    /**
     * multiply operation for floating number
     * @param   Number multiplier
     * @param   Number multiplicand
     * @return  Number
     */
    multiply : function (multiplier, multiplicand, decimalBit)
    {
        decimalBit = decimalBit ? parseInt(decimalBit) : 0;
        var power = Math.pow(10, decimalBit);
        multiplier      = Math.floor(multiplier * power);
        multiplicand    = Math.floor(multiplicand * power);

        var result = multiplier * multiplicand / power / power;
        return result;
    },

    /**
     * plus operation for floating number
     * @param   Number addend
     * @param   Number addend2
     * @return  Number
     */
    plus : function (addend, addend2, decimalBit)
    {
        decimalBit = decimalBit ? parseInt(decimalBit) : 0;
        var power = Math.pow(10, decimalBit);
        addend    = Math.floor(addend * power);
        addend2   = Math.floor(addend2 * power);

        var result = (addend + addend2) / power;
        return result;
    }

};
