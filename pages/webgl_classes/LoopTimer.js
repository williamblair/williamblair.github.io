/*
 * Keeps track of FPS and frame time
 */
class LoopTimer {
    /**
      @brief LoopTimer constructor
      @param [fpsDomID] string id of the element to store the current FPS in
    */
    constructor(fpsDomID) {
        this.lastFrameTime = new Date().getMilliseconds();
        this.fps = 0.0;
        this.dt = 0;
        this.framesPassed = 0;
        this.fpsCounter = 0;
        this.fpsDom = document.getElementById(fpsDomID);
        if (!this.fpsDom) {
            Debug.Error("LoopTimer constructor failed to get FPS dom element");
        }
    }

    /**
      @brief updates the internal timer count; should be called
             once per frame (increases internal frame count by 1)
    */
    Update() {
        const curFrameTime = new Date().getMilliseconds();
        const saveDt = this.dt;

        // not sure why this is sometimes negative...
        this.dt = curFrameTime - this.lastFrameTime;
        if (this.dt < 0) {
            this.dt = saveDt;
        }
        this.lastFrameTime = curFrameTime;
        ++this.framesPassed;
        this.fpsCounter += this.dt;

        // every second, update the FPS
        if (this.fpsCounter >= 1000) {
            this.fps = (this.framesPassed / this.fpsCounter) * 1000.0;
            this.fpsDom.innerHTML = "FPS: " + this.fps;
            this.framesPassed = 0;
            this.fpsCounter = 0;
        }
    }
}

