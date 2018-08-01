// http://kenany.me/blog/base64-js/
var utf8 = {
    encode: function(str) { return unescape( encodeURIComponent(str) ); },
    decode: function(str) { return decodeURIComponent( escape(str) ); }
};