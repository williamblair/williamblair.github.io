/* FPS Camera */
class FPSCamera {
    constructor() {
        this.viewMatrix = mat4.create();
        mat4.identity(this.viewMatrix);

        this.position = vec3.fromValues(0.0, 0.0, 5.0);
        this.target = vec3.fromValues(0.0, 0.0, 0.0);
        this.up = vec3.fromValues(0.0, 1.0, 0.0);
        this.forward = vec3.fromValues(0.0, 0.0, -1.0);
        this.right = vec3.fromValues(1.0, 0.0, 0.0);

        this.viewMatrix = mat4.create();
        mat4.lookAt(
            this.viewMatrix,
            this.position,
            this.target,
            this.up
        );

        this.pitch = 0.0;
        this.yaw = 0.0;

        this.forwardSpeed = 0.0;
        this.strafeSpeed = 0.0;

        this.keyboardInputActive = true;
        this.cameraRotate = false;
        this.setKeyboardInput();
    }

    /**
        @brief move the camera position and recompute the view matrix
        @param [dt] delta frame time in seconds
    */
    Update(dt) {

        if (!this.keyboardInputActive) {
            return;
        }

        if (Math.abs(this.forwardSpeed) > 0.0001 ||
            Math.abs(this.strafeSpeed) > 0.0001) {
            //console.log("Move, dt: ", dt);
            this.Move(
                this.forwardSpeed * dt,
                this.strafeSpeed * dt
            );
        }

        var pitchRot = quat.create();
        quat.rotateX(pitchRot, pitchRot, this.pitch);
        vec3.transformQuat(this.up, [0.0, 1.0, 0.0], pitchRot);
        vec3.normalize(this.up, this.up);
        //console.log("FPS Camera Update up: ", this.up);

        var yawRot = quat.create();
        quat.rotateY(yawRot, yawRot, this.yaw);
        vec3.transformQuat(this.right, [1.0, 0.0, 0.0], yawRot);
        vec3.normalize(this.right, this.right);
        //console.log("FPS Camera Update right: ", this.right);

        vec3.cross(this.forward, this.up, this.right);
        vec3.normalize(this.forward, this.forward);
        //console.log("FPS Camera Update forward: ", this.forward);

        vec3.add(this.target, this.position, this.forward);
        //console.log("FPS camera target: ", this.target);

        //console.log("FPS camera position: ", this.position);

        mat4.lookAt(
            this.viewMatrix,
            this.position,
            this.target,
            [0.0, 1.0, 0.0]
        );
    }

    /**
        @brief move the camera based on the current pitch and yaw angles
        @param [forwardAmount] amount of forward or backwards movement (positive = forward, negative = backward)
        @param [strafeAmount] amount of right/left movement (positive = right, negative = left)
    */
    Move(forwardAmount, strafeAmount) {
        var tmpForward = vec3.clone(this.forward);
        vec3.scale(tmpForward, tmpForward, forwardAmount);
        vec3.add(this.position, this.position, tmpForward);

        var tmpRight = vec3.clone(this.right);
        vec3.scale(tmpRight, tmpRight, strafeAmount);
        vec3.add(this.position, this.position, tmpRight);
    }

    setKeyboardInput() {
        var thisObj = this;
        document.onkeydown = function(e) {
            if (!thisObj.keyboardInputActive) {
                return;
            }
            //console.log('Keydown code: ', e.keyCode);
            switch (e.keyCode) {
                // w
                case 87:
                    thisObj.forwardSpeed = 1.0;
                    break;
                // a
                case 65:
                    thisObj.strafeSpeed = -1.0;
                    break;
                // s
                case 83:
                    thisObj.forwardSpeed = -1.0;
                    break;
                // d
                case 68:
                    thisObj.strafeSpeed = 1.0;
                    break;
                default:
                    break;
            }
        }
        document.onkeyup = function(e) {
            //console.log('Keyup code: ', e.keyCode);
            switch (e.keyCode) {
                // w
                case 87:
                    camera.forwardSpeed = 0.0;
                    break;
                // a
                case 65:
                    camera.strafeSpeed = 0.0;
                    break;
                // s
                case 83:
                    camera.forwardSpeed = 0.0;
                    break;
                // d
                case 68:
                    camera.strafeSpeed = 0.0;
                    break;
                default:
                    break;
            }
        }
        document.onmousemove = function(e) {
            //console.log('movementX, movementY: ', e.movementX, e.movementY);
            if (thisObj.cameraRotate) {
                const rate = 0.001;
                var pitch = -e.movementY * rate;
                var yaw = -e.movementX * rate;
                thisObj.pitch += pitch;
                thisObj.yaw += yaw;
            }
        }
        document.onmousedown = function(e) {
            //console.log('mousedown button: ', e.button);
            // left mouse click
            if (e.button == 0) {
                thisObj.cameraRotate = true;
            }
        }
        document.onmouseup = function(e) {
            //console.log('mouseup button: ', e.button);
            if (e.button == 0) {
                thisObj.cameraRotate = false;
            }
        }
    }

}
