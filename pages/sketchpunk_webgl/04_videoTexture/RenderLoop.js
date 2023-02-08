class RenderLoop{

    constructor(callback, fps) {
        var oThis = this; // this copy
        this.msLastFrame = null; // the time in milliseconds of the last frame
        this.callback = callback;
        this.isActive = false; // control on/off state of the render loop
        this.fps = 0; // save value of loop frames per second

        if (fps != undefined && fps > 0) { // run method that limits framerate

            this.msFpsLimit = 1000.0 / fps; // how many milliseconds per frame in 1 second

            // calculate deltatime between frames and fps currently
            this.run = function() {
                var msCurrent = performance.now();
                var msDelta = msCurrent - oThis.msLastFrame;
                var deltaTime = msDelta / 1000.0; // what fraction of a second is this delta time

                // execute frame since time has elapsed
                if (msDelta >= oThis.msFpsLimit) {
                    oThis.fps = Math.floor(1.0 / deltaTime);
                    oThis.msLastFrame = msCurrent;
                    oThis.callback(deltaTime);
                }

                // schedule another frame
                if (oThis.isActive) window.requestAnimationFrame(oThis.run);
            };
        }
        // run method that runs as fast as browser lets it
        else {
            this.run = function() {
                // calculate delta time between frames and fps currently
                var msCurrent = performance.now(); // current time milliseconds
                var deltaTime = (msCurrent - oThis.msLastFrame) / 1000.0;
                
                oThis.fps = Math.floor(1.0 / deltaTime);
                oThis.msLastFrame = msCurrent;

                oThis.callback(deltaTime);
                if (oThis.isActive) window.requestAnimationFrame(oThis.run);
            };
        }
          
    }

    start() {
        this.isActive = true;
        this.msLastFrame = performance.now();
        window.requestAnimationFrame(this.run);
        return this;
    }

    stop() {
        this.isActive = false;
    }
}

