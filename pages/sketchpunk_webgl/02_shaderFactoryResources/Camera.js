class Camera{
    constructor(gl, fov, near, far) {
        this.projectionMatrix = new Float32Array(16);
        var aspect = gl.canvas.width / gl.canvas.height;
        Matrix4.perspective(
            this.projectionMatrix,
            fov || 45,
            aspect,
            near || 0.1,
            far || 100.0
        );

        this.transform = new Transform(); // camera position
        this.viewMatrix = new Float32Array(16);

        this.mode = Camera.MODE_ORBIT;
    }

    panX(v) {
        if (this.mode == Camera.MODE_ORBIT) return; // panning on X axis only allowed in free mode
        this.updateViewMatrix();
        this.transform.position.x += this.transform.right[0] * v;
        this.transform.position.y += this.transform.right[1] * v;
        this.transform.position.z += this.transform.right[2] * v;
    }

    panY(v) {
        this.updateViewMatrix();
        this.transform.position.y += this.transform.up[1] * v;
        if (this.mode == Camera.MODE_ORBIT) return; // can only move up and down the y axis in orbit mode
        this.transform.position.x += this.transform.up[0] * v;
        this.transform.position.z += this.transform.up[2] * v;
    }

    panZ(v) {
        this.updateViewMatrix();
        if (this.mode == Camera.MODE_ORBIT) {
            this.transform.position.z += v; // orbit mode does translate after rotate, so only need to set z, rotate will handle rest
        }
        else {
            // in freeform mode move forward
            this.transform.position.x += this.transform.forward[0] * v;
            this.transform.position.y += this.transform.forward[1] * v;
            this.transform.position.z += this.transform.forward[2] * v;
        }
    }

    updateViewMatrix() {
        if (this.mode == Camera.MODE_FREE) {
            this.transform.matView.reset()
                .vtranslate(this.transform.position)
                .rotateX(this.transform.rotation.x * Transform.deg2Rad)
                .rotateY(this.transform.rotation.y * Transform.deg2Rad);
        }
        else {
            this.transform.matView.reset()
                .rotateX(this.transform.rotation.x * Transform.deg2Rad)
                .rotateY(this.transform.rotation.y * Transform.deg2Rad)
                .vtranslate(this.transform.position)
        }

        this.transform.updateDirection();

        // camera view matrix is inverse of position/rotation
        Matrix4.invert(this.viewMatrix, this.transform.matView.raw);
        return this.viewMatrix;
    }

    // returns copy of view matrix without translate component
    getTranslatelessMatrix() {
        var mat = new Float32Array(this.viewMatrix);
        mat[12] = mat[13] = mat[14] = 0.0; // reset translation position in matrix to 0
        return mat;
    }
}

Camera.MODE_FREE = 0; // allows free movement of position/rotation, basicall fps camera
Camera.MODE_ORBIT = 1; // movement locked to rotate around origin

class CameraController {
    constructor(gl, camera) {
        var oThis = this; // this copy
        var box = gl.canvas.getBoundingClientRect();
        this.canvas = gl.canvas;
        this.camera = camera;
        
        this.rotateRate = -300; // how fast to rotate; degrees per dragging delta
        this.panRate = 5; // how fast to pan, max unit per dragging delta
        this.zoomRate = 200; // how fast to zoom/forward backward movement

        this.offsetX = box.left;
        this.offsetY = box.top;

        this.initX = 0; // mouse position on mouse down
        this.initY = 0;
        this.prevX = 0; // prev mouse position on mouse move
        this.prevY = 0;

        this.onUpHandler = function(e) { oThis.onMouseUp(e); }
        this.onMoveHandler = function(e) { oThis.onMouseMove(e); }

        this.canvas.addEventListener("mousedown", function(e){ oThis.onMouseDown(e); });
        this.canvas.addEventListener("mousewheel", function(e){ oThis.onMouseWheel(e); });
    }

    // transform mouse x,y coords to relative coords
    getMouseVec2(e) {
        return {
          x: e.pageX - this.offsetX,
          y: e.pageY - this.offsetY
        };
    }

    // begin listening for dragging movement
    onMouseDown(e) {
        this.initX = this.prevX = e.pageX - this.offsetX;
        this.initY = this.prevY = e.pageY - this.offsetY;

        this.canvas.addEventListener("mouseup", this.onUpHandler);
        this.canvas.addEventListener("mousemove", this.onMoveHandler);
    }

    // end listening for dragging movement
    onMouseUp(e) {
        this.canvas.removeEventListener("mouseup", this.onUpHandler);
        this.canvas.removeEventListener("mousemove", this.onMoveHandler);
    }

    onMouseWheel(e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        this.camera.panZ(delta * (this.zoomRate / this.canvas.height));
    }

    onMouseMove(e) {
        var x = e.pageX - this.offsetX;
        var y = e.pageY - this.offsetY; 
        var dx = x - this.prevX;
        var dy = y - this.prevY;

        // when shift held, we pan around; otherwise rotate
        if (!e.shiftKey) {
            this.camera.transform.rotation.y += dx * (this.rotateRate / this.canvas.width);
            this.camera.transform.rotation.x += dy * (this.rotateRate / this.canvas.height);
        }
        else {
            this.camera.panX(-dx * (this.panRate / this.canvas.width));
            this.camera.panY(dy * (this.panRate / this.canvas.height));
        }

        this.prevX = x;
        this.prevY = y;
    }
}


