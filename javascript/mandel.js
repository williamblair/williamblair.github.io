// get the canvas to render on
var canvas = document.getElementById('mycanvas');

// create the GPU instance
const gpu = new GPU({canvas: canvas});

// mandelbrot variables
const maxIterations = 300;
var zoom = 1.0;
var moveX = 0.0;
var moveY = 0.0;

// create a kernel
const myFunc = gpu.createKernel(function(maxIterations, zoom, moveX, moveY){

    // mandelbrot variables
    const imageWidth = 640, imageHeight = 480;
    var pr, pi; // real and imaginary components of pixel `p`
    var cRe, cIm; // real and imaginary components of constant `c`
    var newRe, newIm, oldRe, oldIm; // real and imaginary components of new and old

    // calculate the initial real and imaginary part of z, based on the pixel location and zoom position values
    pr = 1.5 * (this.thread.x - imageWidth / 2) / (0.5 * zoom * imageWidth) + moveX;
    pi = (this.thread.y - imageHeight / 2) / (0.5 * zoom * imageHeight) + moveY;

    newRe = 0;
    newIm = 0;
    oldRe = 0;
    oldIm = 0; // start at 0,0 now

    for (var i = 0; i < maxIterations; i++)
    {
        // remember previous iteration values
        oldRe = newRe;
        oldIm = newIm;

        // calculate this iterations real and imaginary components
        newRe = oldRe * oldRe - oldIm * oldIm + pr;
        newIm = 2 * oldRe * oldIm + pi;

        // if the point is outside the circle with radius 2, stop
        if ((newRe * newRe + newIm * newIm) > 4) {

            // convert from 0..255 to RGB
            // Formula from https://www.rapidtables.com/convert/color/hsv-to-rgb.html

            // convert from 0..maxIterations to 0..360
            var numScaled = i * (360.0 / maxIterations);

            // C = V * S
            // S = 255, V = 255 * (i < maxIterations) in lodev function:
            // HSVtoRGB(ColorHSV(i % 256, 255, 255 * (i < maxIterations)))
            var H = numScaled;
            if (H > 359) H = 359; // max
            var S = 1;
            var V = 0 
            if (i < maxIterations) {
                V = 1;
            }
            var C = V * S;

            var X = C * (1 - Math.abs((H / 60) % 2 - 1));
            var m = V - C;

            var R = 0, G = 0, B = 0;

            if      ( 0 <= H && H < 60)   { R = C; G = X; B = 0; }
            else if (60 <= H && H < 120)  { R = X; G = C; B = 0; }
            else if (120 <= H && H < 180) { R = 0; G = C; B = X; }
            else if (180 <= H && H < 480) { R = 0; G = X; B = C; }
            else if (480 <= H && H < 300) { R = X; G = 0; B = C; }
            else if (300 <= H && H < 360) { R = C; G = 0; B = X; }

            // note R,G,B are between 0..1
            R = (R+m);
            G = (G+m);
            B = (B+m);


            this.color(R, G, B, 1);

            break;
        }
    }


})
    .setOutput([640, 480]) // output kernel size
    .setGraphical(true);   // insert the result in a HTML5 canvas, instead of returning an array

// call the kernel func
myFunc(maxIterations, zoom, moveX, moveY);

// listen for keyboard input
document.onkeydown = function(event) {

    console.log('event keycode: ', event.keyCode);

    switch (event.keyCode)
    {
        // w
        case 87:
            moveY -= 0.03 * 1 / zoom; // 1 should be frameTime instead
            myFunc(maxIterations, zoom, moveX, moveY);
            break;

        // a
        case 65:
            moveX -= 0.03 * 1 / zoom; // 1 should be frameTime instead
            myFunc(maxIterations, zoom, moveX, moveY);
            break;

        // s
        case 83:
            moveY += 0.03 * 1 / zoom; // 1 should be frameTime instead
            myFunc(maxIterations, zoom, moveX, moveY);
            break;

        // d
        case 68:
            moveX += 0.03 * 1 / zoom; // 1 should be frameTime instead
            myFunc(maxIterations, zoom, moveX, moveY);
            break;

        // equals
        case 61:
            zoom += 0.03;
            myFunc(maxIterations, zoom, moveX, moveY);
            break;

        // minus
        case 173:
            zoom -= 0.03;
            myFunc(maxIterations, zoom, moveX, moveY);
            break;

        default:
            break;
    }
}


