(function() {

    /* Get the app instance */
    var app = angular.module('myApp');

    /* Create a controller */
    var editorController = function($scope) {
        
        /* Initial load */
        $scope.init = function() {
            console.log('In scope init!');
            
            $(function(){
                $('#editorArea1').text(`var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

var palette = [
    0x070707,
    0x1f0707,
    0x2f0f07,
    0x470f07,
    0x571707,
    0x671f07,
    0x771f07,
    0x8f2707,
    0x9f2f07,
    0xaf3f07,
    0xbf4707,
    0xc74707,
    0xDF4F07,
    0xDF5707,
    0xDF5707,
    0xD75F07,
    0xD7670F,
    0xcf6f0f,
    0xcf770f,
    0xcf7f0f,
    0xCF8717,
    0xC78717,
    0xC78F17,
    0xC7971F,
    0xBF9F1F,
    0xBF9F1F,
    0xBFA727,
    0xBFA727,
    0xBFAF2F,
    0xB7AF2F,
    0xB7B72F,
    0xB7B737,
    0xCFCF6F,
    0xDFDF9F,
    0xEFEFC7,
    0xFFFFFF
];

//var BUFF_WIDTH = 300;
//var BUFF_HEIGHT = 100;
var BUFF_WIDTH=600;
var BUFF_HEIGHT=300;

// testing double the size
var PIX_BUF_WIDTH = 600;
var PIX_BUF_HEIGHT = 300;
var BYTES_PER_PIXEL = 4;

var SCALE = BUFF_WIDTH/PIX_BUF_WIDTH; // scale from array to larger pixel texture

var buff = ctx.createImageData(PIX_BUF_WIDTH, PIX_BUF_HEIGHT); // actual pixel data
var pal_buf = [];
for (var i=0; i<(BUFF_HEIGHT-1)*BUFF_WIDTH; i++) {
    pal_buf.push(0);
}
for (var i=0; i<BUFF_WIDTH; i++) {
    pal_buf.push(palette.length-1);
}

function drawFire() 
{
    var wind = document.getElementById("wind").valueAsNumber;
    
    for (var x=0; x<BUFF_WIDTH; x++)
    {
        for (var y=BUFF_HEIGHT-2; y>=0; y--)
        {
            // scale the height of our flame by randomly choosing wether to decrease or not
            var newVal = pal_buf[x+BUFF_WIDTH*(y+1)]-(Math.random() < 0.2);
            if (newVal < 0) newVal = 0;
            
            var xRand = (x-2+Math.floor(Math.random()*5) + wind)%BUFF_WIDTH;
            pal_buf[y*BUFF_WIDTH+xRand] = newVal;
        }
    }
    
    update();
    
    requestAnimationFrame(drawFire);
}

requestAnimationFrame(drawFire);

function update() {
    var x=0, y=0;
    for (var i=0; i<pal_buf.length; i++) {
    
        var val = palette[pal_buf[i]];
        var r = (val>>16) & 0xFF;
        var g = (val>>8) & 0xFF;
        var b = val & 0xFF;
        
        for (var offset_x=0; offset_x < SCALE; offset_x++) {
            for (var offset_y=0; offset_y<SCALE; offset_y++) {
                var index = ((y+offset_y)*PIX_BUF_WIDTH+(x+offset_x))*BYTES_PER_PIXEL;
                
                buff.data[index+0] = r;
                buff.data[index+1] = g;
                buff.data[index+2] = b;
                buff.data[index+3] = 255;
            }
        }
        
        x += SCALE;
        if (x >= PIX_BUF_WIDTH) {
            x = 0;
            y += SCALE;
        }
    }
    ctx.putImageData(buff, 0,0);
}
		`); //, function(){

                    console.log('load performed!');

                    editor = ace.edit("editorArea1");
                    editor.setTheme("ace/theme/monokai");
                    editor.getSession().setMode("ace/mode/javascript");
                    document.getElementById("editorArea1").style.fontSize="14px";

                    /* set the function to run when the button is clicked */
                    var button = document.getElementById('runButton');
                    button.onclick = function() {
                        var animate = new Function(editor.getValue());
                        animate();
                    };

                    /* Run the function when the web page loads */
                    var initialFunc = new Function(editor.getValue());
                    initialFunc();
            });
        }

    };

    /* Register the controller */
    app.controller('fireController', editorController);

})();


