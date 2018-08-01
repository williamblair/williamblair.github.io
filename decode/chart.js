/* This only works if the browser is in utf-8 mode */

var map = [
    [ 'ï¼¡',  'Ａ'],
    [ 'ï¼¢',  'Ｂ'],
    [ 'ï¼£',  'Ｃ'],
    [ 'ï¼¤',  'Ｄ'],
    [ 'ï¼¥',  'Ｅ'],
    [ 'ï¼¦',  'Ｆ'],
    [ 'ï¼§',  'Ｇ'],
    [ 'ï¼¨',  'Ｈ'],
    [ 'ï¼©',  'Ｉ'],
    [ 'ï¼ª',  'Ｊ'],
    [ 'ï¼«',  'Ｋ'],
    [ 'ï¼¬',  'Ｌ'],
    [ 'ï¼­',  'Ｍ'],
    [ 'ï¼®',  'Ｎ'],
    [ 'ï¼¯',  'Ｏ'],
    [ 'ï¼°',  'Ｐ'],
    [ 'ï¼±',  'Ｑ'],
    [ 'ï¼²',  'Ｒ'],
    [ 'ï¼³',  'Ｓ'],
    [ 'ï¼´',  'Ｔ'],
    [ 'ï¼µ',  'Ｕ'],
    [ 'ï¼¶',  'Ｖ'],
    [ 'ï¼·',  'Ｗ'],
    [ 'ï¼¸',  'Ｘ'],
    [ 'ï¼¹',  'Ｙ'],
    [ 'ï¼º',  'Ｚ'],
    
    [ 'ï½',  'ａ'],
    [ 'ï½‚',  'ｂ'],
    [ 'ï½ƒ',  'ｃ'],
    [ 'ï½„',  'ｄ'],
    [ 'ï½…',  'ｅ'],
    [ 'ï½†',  'ｆ'],
    [ 'ï½‡',  'ｇ'],
    [ 'ï½ˆ',  'ｈ'],
    [ 'ï½‰',  'ｉ'],
    [ 'ï½Š',  'ｊ'],
    [ 'ï½‹',  'ｋ'],
    [ 'ï½Œ',  'ｌ'],
    [ 'ï½',  'ｍ'],
    [ 'ï½Ž',  'ｎ'],
    [ 'ï½',  'ｏ'],
    [ 'ï½',  'ｐ'],
    [ 'ï½‘',  'ｑ'],
    [ 'ï½’',  'ｒ'],
    [ 'ï½“',  'ｓ'],
    [ 'ï½”',  'ｔ'],
    [ 'ï½•',  'ｕ'],
    [ 'ï½–',  'ｖ'],
    [ 'ï½—',  'ｗ'],
    [ 'ï½˜',  'ｘ'],
    [ 'ï½™',  'ｙ'],
    [ 'ï½š',  'ｚ'],
    
    [ 'ï¼', '０'],
    [ 'ï¼‘', '１'],
    [ 'ï¼’', '２'],
    [ 'ï¼“', '３'],
    [ 'ï¼”', '４'],
    [ 'ï¼•', '５'],
    [ 'ï¼–', '６'],
    [ 'ï¼—', '７'],
    [ 'ï¼˜', '８'],
    [ 'ï¼™', '９'],
    
    [ 'ã€€',  '　'],
    [ 'ï¼†',  '＆'],
    [ 'ï¼ˆ', '（'],
    [ 'ï¼‰', '）'],
    [ 'â€', '”']
]

function decodeChar(str)
{   
    var result = map.filter(entry => entry[0] === str);
    if (result.length === 0) return '?';
    else  {
        return result[0][1];
    }   
}

function encodeChar(str)
{
    console.log('given str: ', str);
    var result = map.filter(entry => entry[1] === str);
    if (result.length === 0) return '？';
    else                     return result[0][0];
}

function decodeString(str)
{
    var result = '';
    for (var i = 0; i <= str.length-3; i+=3)
    {
        var nextChar = decodeChar(str.substring(i,i+3));
        
        result += nextChar;
    }
    
    return result;
}

function encodeString(str)
{
    var result = '';
    for (var i = 0; i < str.length; i++)
    {
        var nextChar = encodeChar(str.charAt(i));       
        
        result += nextChar;
    }
    
    return result;
}