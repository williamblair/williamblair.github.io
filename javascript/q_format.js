/*
 * Q Format Stuff
 *
 * https://en.wikipedia.org/wiki/Q_(number_format)
 */

// num = number to convert
// m = number of bits to represent the integer component
// n = number of bits to represent the decimal component
var Float_to_Q = function(num, m, n) {
   return Math.round(num * (1 << n));
}

// num = number to convert
// m = number of bits to represent the integer component
// n = number of bits to represent the decimal component
var Q_to_Float = function(num, m, n) {
    return (1.0*num)*(1.0/(1 << n));
}

var Q_add = function(num1, num2, m, n) {
    return num1 + num2; // no need for divisors here
}

var Q_subtract = function(num1, num2, m, n) {
    return num1 - num2; // no need for divisors here
}

var Q_multiply = function(num1, num2, m, n) {

    var tmp = num1 * num2;
    console.log('    tmp: ', tmp);

    // round up
    tmp += (1 << (n - 1));
    console.log('    tmp: ', tmp);
    
    // divide by denominator
    result = tmp >> n;

    
    return result;
}

var Q_divide = function(num1, num2, m, n) {
    
    // upscale by the base
    var tmp = num1 << n;

    // mid values are rounded up (down for negative vals)
    if (haveSameSign(tmp, num2)) {
        tmp += num2 >> 1;
    }
    else {
        tmp -= num2 >> 1;
    }

    return Math.floor(tmp / num2);
}

var haveSameSign = function(num1, num2) {
    return (num1 >= 0 && num2 >= 0) || 
           (num1  < 0 && num2 < 0);
}




