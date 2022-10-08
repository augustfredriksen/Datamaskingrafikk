'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import {RotateThing} from '../../base/shapes/CraneRotateThing.js';
import { RotateThingLid } from '../../base/shapes/CraneRotateThingLid.js';

/**
 * Klasse som implementerer en sammensatt figur.
 */
export class CompositeRotateThing {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.rotatething = new RotateThing(app);
        this.rotatething.initBuffers();

        this.rotatethinglid = new RotateThingLid(app);
        this.rotatethinglid.initBuffers();

        this.translationX = 0;
    }

    handleKeys(elapsed) {
        // Dersom ev. del-figur skal animeres håndterer den det selv.
        //this.cone.handleKeys(elapsed);
        // Flytter hele figuren:
        if (this.app.currentlyPressedKeys[89]) {    //Y
            this.translationX = this.translationX + 1*elapsed;
        }
        if (this.app.currentlyPressedKeys[85]) {    //U
            this.translationX = this.translationX - 1*elapsed;
        }
    }

    //MERK: Kaller ikke super.draw() siden klassen ikke arver fra BaseShape:
    draw(textureShaderInfo, elapsed, modelMatrix = new Matrix4()) {

        this.stack.pushMatrix(modelMatrix);	 	//Legges på toppen av stacken.

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 0, 0);
        modelMatrix.scale(1, 1, 1);
        this.rotatething.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 0, 0);
        modelMatrix.scale(1, 1, 1);
        this.rotatethinglid.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 0, -2);
        modelMatrix.scale(1, 1, 1);
        this.rotatethinglid.draw(textureShaderInfo, elapsed, modelMatrix);

        //Tømmer stacken ...:
        this.stack.empty();
    }
}


