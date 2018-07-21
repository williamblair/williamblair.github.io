/* all this code taken from 
 * http://web-wise-wizard.com/javascript-tutorials/javascript-jscript-get-user-information.html 
 * slightly modified */
function getLanguage(){
    if( navigator.userLanguage == "string") {
        return navigator.userLanguage;
    } else if( navigator.language == "string"){
        return navigator.language;
    } else {
        return "(Not Supported)";
    }
}

function versionMinor() {
    var versMajor = parseInt(navigator.appVersion,10);
    var appVers = navigator.appVersion;

    var pos, versMinor = 0;

    if ((pos = appVers.indexOf ("MSIE")) > -1) {
        versMinor = parseFloat(appVers.substr (pos+5));
    } else {
        versMinor = parseFloat(appVers);
    }
    
    return (versMinor);
}
                
var codeName   = navigator.appCodeName;
var appName    = navigator.appName;
var appVersion = navigator.appVersion;
var language   = getLanguage();
var platform   = navigator.platform;
var userAgent  = navigator.userAgent;
var swidth     = (window.screen) ? screen.width  : 0;
var sheight    = (window.screen) ? screen.height : 0;

document.getElementById('codeName').innerHTML = codeName;
document.getElementById('appName').innerHTML = appName;
document.getElementById('appVers').innerHTML = appVersion;
document.getElementById('language').innerHTML = language;
document.getElementById('platform').innerHTML = platform;
document.getElementById('userAgent').innerHTML = userAgent;
document.getElementById('screenSize').innerHTML = swidth + "x" + sheight;
