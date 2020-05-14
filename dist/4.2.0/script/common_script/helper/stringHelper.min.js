/**
 * helper to handle some string.
 */

import arrayHelper from './array';

export default {
    /**
     * repeat string
     * @param String  string
     * @param Number  times
     */
    repeat : function(string, times)
    {
        var result = "";

        for (var i=1; i<=times; i++)
        {
            result += string;
        }

        return result;
    },

    /**
     * replace string
     * @param string  String  The string being searched and replaced on.
     * @param find    String  The value being searched for.
     * @param replace String  The replacement value that replaces found search values.
     * @returns String
     */
    replace : function(string, find, replace)
    {
        if (find == replace) {
            return string;
        }

        var oStr = new String(string);
        while (oStr.indexOf(find) >= 0) {
            oStr = oStr.replace(find, replace);
        }
        return oStr;
    },

    /**
     * replace some data with key
     * @param string String
     * @param data Object  key-value pairs
     * @returns String
     */
    replaceData : function(string, data)
    {
        for (var p in data) {
            while (string.indexOf(p) >= 0) {
                string = string.replace(p, data[p]);
            }
        }

        return string;
    },

    /**
     * get random chinese name
     * @return String
     */
    getRandomChineseName : function ()
    {
        var surnameList = [
            '赵','钱','孙','李','周','吴','郑','王',
            '冯','陈','褚','卫','蒋','沈','韩','杨',
            '朱','秦','尤','许','何','吕','施','张',
            '孔','曹','严','华','金','魏','陶','姜'
        ];

        var secondWordList = ['云','化','京','彦','小','志','书','健','思','嘉','明'];

        var thirdWordList = ['腾','东','宏','龙','川','东','福','林','聪','诚','珠'];

        var surname     = surnameList[Math.ceil(Math.random() * (surnameList.length - 1))];
        var secondWord  = secondWordList[Math.ceil(Math.random() * (secondWordList.length - 1))];
        var thirdWord   = thirdWordList[Math.ceil(Math.random() * (thirdWordList.length - 1))];

        var fullname = surname + secondWord + thirdWord;
        return fullname;
    },

    getRandomNickName : function () {
        var list = [
            '风月斟酒',
            '温柔眼眉',
            '吃不饱的大可爱~',
            '脸美逼遭罪@',
            '承诺i',
            '站在千里之外',
            '島是海哭碎菂訫',
            '叫我小透明',
            '别同情我',
            '库存已久',
            '玖忆惜梦',
            '愿你余生不孤寂',
            '二智少女',
            '半夏微凉、不成殇',
            '爱耍流氓的兔子',
            '半城樱花半城雨﹌',
            '野性随风.',
            '≠无心少女',
            '葬于她心',
            '旁观者',
            '你听我说',
            '不惯与生人识',
            '你并不孤单',
            '青袂宛约',
            '让我盲目',
            '夜夜思量',
            '拖拉机再垃圾也能拖垃圾',
            '你会腻我何必',
            '我可爱炸了.',
            '年少轻狂。',
            '走过的路',
            '占有欲',
            '眠里微光。',
            '一灯孤',
            '几支紫钗挽青丝',
            '遥歌',
            '泠泠七弦上',
            '清風与我',
            '善悪不定夺',
            '温致如猫'
        ];
        return arrayHelper.getRandomItem(list);
    },

    /**
     * @example:  #逗逼# 啦啦啦 #二逼#  =>  <span class="highlightTextColor">#逗逼#</span> 啦啦啦 <span class="highlightTextColor">#二逼#</span>
     * return String
     */
    highlightTopicWords : function (text, classList)
    {
        var classStr = typeof(classList) === 'object' ? classList.join(' ') : classList;

        var reg = /(#[^#]*#)/g;
        var replaceStr = '<span class="' + classStr + '">$&</span>';

        text = text.replace(reg, replaceStr);

        return text;
    }

}

