/* This only works if the browser is in utf-8 mode */
function mapStr(str)
{
    //console.log('given str: ', str);
    switch(str)
    {
        case 'ï¼¡': return 'Ａ';
        case 'ï¼¢': return 'Ｂ';
        case 'ï¼£': return 'Ｃ';
        case 'ï¼¤': return 'Ｄ';
        case 'ï¼¥': return 'Ｅ';
        case 'ï¼¦': return 'Ｆ';
        case 'ï¼§': return 'Ｇ';
        case 'ï¼¨': return 'Ｈ';
        case 'ï¼©': return 'Ｉ';
        case 'ï¼ª': return 'Ｊ';
        case 'ï¼«': return 'Ｋ';
        case 'ï¼¬': return 'Ｌ';
        //case 'ï¼': return 'M';
        case 'ï¼®': return 'Ｎ';
        case 'ï¼¯': return 'Ｏ';
        case 'ï¼°': return 'Ｐ';
        case 'ï¼±': return 'Ｑ';
        case 'ï¼²': return 'Ｒ';
        case 'ï¼³': return 'Ｓ';
        case 'ï¼´': return 'Ｔ';
        case 'ï¼µ': return 'Ｕ';
        case 'ï¼¶': return 'Ｖ';
        case 'ï¼·': return 'Ｗ';
        case 'ï¼¸': return 'Ｘ';
        case 'ï¼¹': return 'Ｙ';
        case 'ï¼º': return 'Ｚ';
        
        case 'ï½': return 'ａ';
        case 'ï½‚': return 'ｂ';
        case 'ï½ƒ': return 'ｃ';
        case 'ï½„': return 'ｄ';
        case 'ï½…': return 'ｅ';
        case 'ï½†': return 'ｆ';
        case 'ï½‡': return 'ｇ';
        case 'ï½ˆ': return 'ｈ';
        case 'ï½‰': return 'ｉ';
        case 'ï½Š': return 'ｊ';
        case 'ï½‹': return 'ｋ';
        case 'ï½Œ': return 'ｌ';
        case 'ï½': return 'ｍ';
        case 'ï½Ž': return 'ｎ';
        case 'ï½': return 'ｏ';
        case 'ï½': return 'ｐ';
        case 'ï½‘': return 'ｑ';
        case 'ï½’': return 'ｒ';
        case 'ï½“': return 'ｓ';
        case 'ï½”': return 'ｔ';
        case 'ï½•': return 'ｕ';
        case 'ï½–': return 'ｖ';
        case 'ï½—': return 'ｗ';
        case 'ï½˜': return 'ｘ';
        case 'ï½™': return 'ｙ';
        case 'ï½š': return 'ｚ';
        case 'ã€€': return '　';
        case 'ï¼†': return '＆';
        
        default: return  '?';
    };
}

//var str = 'ï¼¨ï½…ï½Œï½ã€€ï¼†ã€€ï¼§ï½•ï½‰ï½„ï½…ï½Œï½‰ï½Žï½…ï½“';

function decodeString(str)
{
    var result = '';
    for (var i = 0; i <= str.length-3; i+=3)
    {
        var nextChar = mapStr(str.substring(i,i+3));
        
        // if that didn't work, maybe it's a two length one...
        if (nextChar == '?') nextChar = mapStr(str.substring(i,i+2));
        
        result += nextChar;
    }
    
    return result;
}
