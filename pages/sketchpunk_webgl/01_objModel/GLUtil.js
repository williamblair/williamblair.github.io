class GLUtil {

    // convert hex colors to array of floats 0.0...1.0
    // ex) GLUtil.rgbArray("#FF0000", "#00FF00", "#0000FF")
    static rgbArray() {
        if (arguments.length == 0) return null;

        var rtn = [];
        for (var i = 0, c, p; i < arguments.length; ++i) {
            // skip if invalid
            if (arguments[i].length < 6) continue;
            
            c = arguments[i];
            p = (c[0] == "#") ? 1 : 0;

            rtn.push(
                parseInt(c[p+0] + c[p+1], 16) / 255.0,
                parseInt(c[p+2] + c[p+3], 16) / 255.0,
                parseInt(c[p+4] + c[p+5], 16) / 255.0
            );
        }

        return rtn;
    }
}
