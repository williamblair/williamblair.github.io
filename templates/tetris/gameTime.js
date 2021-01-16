
var lastTime = new Date();
var curTime = new Date();

var UpdateGameTime = function()
{
    lastTime = curTime;
    curTime = new Date();
}

// returns time passed since UpdateGameTime() in ms
var GetGameTimeDiff = function()
{
    return curTime - lastTime;
}

