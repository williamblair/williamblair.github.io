/* Orbit Camera */
class OrbitCamera {
    constructor() {
        this.viewMatrix = mat4.create();
        mat4.identity(this.viewMatrix);

        this.radius = 5.0;
        this.position = vec3.fromValues(0.0, 0.0, 5.0);
        this.yaw = 0.0;
        this.pitch = 0.0;

        // TODO - handle non-zero
        this.target = vec3.fromValues(0.0, 0.0, 0.0);
        mat4.lookAt(
            this.viewMatrix,
            this.position,
            this.target,
            [0.0, 1.0, 0.0] // up
        );

        this.keyboardInputActive = true;
        this.cameraRotate = false;
        this.setKeyboardInput();
    }

    /**
        @brief move camera position and recompute view matrix
        @param [dt] delta frame time in seconds
    */
    Update(dt) {
        vec3.set(this.position, 1.0, 0.0, 0.0);
        var pitchRotAxis = vec3.fromValues(1.0, 0.0, 0.0);

        var yawRot = quat.create();
        quat.rotateY(yawRot, yawRot, this.yaw);
        vec3.transformQuat(this.position, this.position, yawRot);
        vec3.normalize(this.position, this.position);
        //console.log('FPS Camera Update tmpPos yaw: ', tmpPos);

        var pitchAxisRot = quat.create();
        quat.rotateY(pitchAxisRot, pitchAxisRot, this.yaw + (Math.PI/2.0));
        vec3.transformQuat(pitchRotAxis, pitchRotAxis, pitchAxisRot);
        vec3.normalize(pitchRotAxis, pitchRotAxis);

        var pitchRot = quat.create();
        quat.setAxisAngle(pitchRot, pitchRotAxis, this.pitch);
        vec3.transformQuat(this.position, this.position, pitchRot);
        vec3.normalize(this.position, this.position);
        //console.log('FPS Camera Update tmpPos pitch: ', tmpPos);

        vec3.scale(this.position, this.position, this.radius);
        //console.log('FPS Camera Update tmpPos radius: ', tmpPos);

        mat4.lookAt(
            this.viewMatrix,
            this.position,
            this.target,
            [0.0, 1.0, 0.0]
        );
    }

    setKeyboardInput() {
        var thisObj = this;
        document.onmousemove = function(e) {
            if (thisObj.cameraRotate) {
                const rate = 0.001;
                var pitch = -e.movementY * rate;
                var yaw = -e.movementX * rate;
                thisObj.pitch += pitch;
                thisObj.yaw += yaw;
            }
        }
        document.onmousedown = function(e) {
            // left mouse click
            if (e.button == 0) {
                thisObj.cameraRotate = true;
            }
        }
        document.onmouseup = function(e) {
            if (e.button == 0) {
                thisObj.cameraRotate = false;
            }
        }
        document.onwheel = function(e) {
            //console.log("OrbitCamera onwheel event: ", e);
            if (e.wheelDelta < 0) {
                thisObj.radius += 1.0;
            }
            else if (e.wheelDelta > 0) {
                thisObj.radius -= 1.0;
                if (thisObj.radius < 1.0) {
                    thisObj.radius = 1.0;
                }
            }
        }
    }
}
