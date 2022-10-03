'use strict';
/*
    Tegner koordinatsystemet.
*/

import {rotateVector} from "../lib/utility-functions.js";

export class Camera {

    constructor(
        gl,
        currentlyPressedKeys = [],
        camPosX=0.1,
        camPosY=100,
        camPosZ=0,
        lookAtX=0,
        lookAtY=0,
        lookAtZ=0,
        upX=0,
        upY=1,
        upZ=0)
    {

        this.gl = gl;
        this.currentlyPressedKeys = currentlyPressedKeys;

        // Kameraposisjon:
        this.camPosX = camPosX;
        this.camPosY = camPosY;
        this.camPosZ = camPosZ;

        // Kamera ser mot ...
        this.lookAtX = lookAtX;
        this.lookAtY = lookAtY;
        this.lookAtZ = lookAtZ;

        // Kameraorientering:
        this.upX = upX;
        this.upY = upY;
        this.upZ = upZ;

        this.near = 0.1;
        this.far = 10000;

        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();
    }

    set() {
        // VIEW-matrisa:
        this.viewMatrix.setLookAt(this.camPosX, this.camPosY, this.camPosZ, this.lookAtX, this.lookAtY, this.lookAtZ, this.upX, this.upY, this.upZ);
        // PROJECTION-matrisa (frustum): cuon-utils: Matrix4.prototype.setPerspective = function(fovy, aspect, near, far)
        const fieldOfView = 45; // I grader.
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        // PROJEKSJONS-matrisa; Bruker cuon-utils: Matrix4.prototype.setPerspective = function(fovy, aspect, near, far)
        this.projectionMatrix.setPerspective(fieldOfView, aspect, this.near, this.far);
    }

    getModelViewMatrix(modelMatrix) {
        return new Matrix4(this.viewMatrix.multiply(modelMatrix)); // NB! rekkefølge!
    }

    setPosition(posX, posY, posZ) {
        this.camPosX = posX;
        this.camPosY = posY;
        this.camPosZ = posZ;
    }

    setLookAt(lookX, lookY, lookZ) {
        this.lookAtX = lookX;
        this.lookAtY = lookY;
        this.lookAtZ = lookZ;
    }

    setUp(upX, upY, upZ) {
        this.lookAtX = upX;
        this.lookAtY = upY;
        this.lookAtZ = upZ;
    }

    setNear(near) {
        this.near = near;
    }

    setFar(far) {
        this.far = far;
    }

    handleKeys(elapsed) {

        let camPosVec = vec3.fromValues(this.camPosX, this.camPosY, this.camPosZ);
        //Enkel rotasjon av kameraposisjonen:
        if (this.currentlyPressedKeys[65]) {    //A
            rotateVector(2, camPosVec, 0, 1, 0);  //Roterer camPosVec 2 grader om y-aksen.
        }
        if (this.currentlyPressedKeys[68]) {	//D
            rotateVector(-2, camPosVec, 0, 1, 0);  //Roterer camPosVec -2 grader om y-aksen.
        }
        if (this.currentlyPressedKeys[87]) {	//W
            rotateVector(2, camPosVec, 1, 0, 0);  //Roterer camPosVec 2 grader om x-aksen.
        }
        if (this.currentlyPressedKeys[83]) {	//D
            rotateVector(-2, camPosVec, 1, 0, 0);  //Roterer camPosVec 2 grader om x-aksen.
        }

        //Zoom inn og ut:
        if (this.currentlyPressedKeys[86]) { //V
            vec3.scale(camPosVec, camPosVec, 1.05);
        }
        if (this.currentlyPressedKeys[66]) {	//B
            vec3.scale(camPosVec, camPosVec, 0.95);
        }

        this.camPosX = camPosVec[0];
        this.camPosY = camPosVec[1];
        this.camPosZ = camPosVec[2];
        this.set();
    }
}


