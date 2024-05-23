class Camera {
    constructor() {
        this.fov = 60;
        this.eye = new Vector3([6, 1, 20]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
        this.viewMatrix = new Matrix4();
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setPerspective(this.fov, canvas.width / canvas.height, 1, 100);
    }

    moveForward() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f = f.normalize();
        this.at = this.at.add(f.mul(1));
        this.eye = this.eye.add(f.mul(1));
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    moveBackwards() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f = f.normalize();
        this.at = this.at.sub(f.mul(1));
        this.eye = this.eye.sub(f.mul(1));
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    moveLeft() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var s = new Vector3();
        s.set(f);
        s = Vector3.cross(f, this.up);
        s = s.normalize();
        this.at = this.at.add(s.mul(0.5));
        this.eye = this.eye.add(s.mul(0.5));
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    moveRight() {
        var f = new Vector3();
        f.set(this.eye);
        f.sub(this.at);
        var s = new Vector3();
        s.set(f);
        s = Vector3.cross(f, this.up);
        s = s.normalize();
        this.at = this.at.add(s.mul(0.5));
        this.eye = this.eye.add(s.mul(0.5));
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    panLeft() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var rotationMatrix = new Matrix4()
            .setRotate(15, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    panRight() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var rotationMatrix = new Matrix4()
            .setRotate(-15, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    rotateBy(rot_mat){
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var f_prime = rot_mat.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
        this.up = rot_mat.multiplyVector3(this.up);
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }
}