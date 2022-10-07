'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import { Wire } from '../../base/shapes/CraneWire.js';
import { CraneJib } from '../Cranes/CraneJib.js';
import { CraneTowerPeak } from '../Cranes/CraneTowerPeak.js';


/**
 * Klasse som implementerer en sammensatt figur.
 */
export class JibPart {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.craneJib = new CraneJib(this.app);
        this.craneTowerPeak = new CraneTowerPeak(this.app);
        this.wire = new Wire(this.app);
        this.wire.initBuffers();

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
        const platformWidth = 4;
        const platformLength = 8;
        const platformHeight = 1;
        const wheelRadius = 1.4;
        const wheelWidth = 0.4;
        const wheelPosZ = platformWidth + 2*wheelWidth;
        const wheelPosX = platformLength / 1.8;
        const wheelPosY = platformHeight * 1.2;

        this.stack.pushMatrix(modelMatrix);	 	//Legges på toppen av stacken.

        //Crane Jib ---------------------- SIDE A
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 0, 0);
        modelMatrix.scale(1, 1, 1);
        modelMatrix.rotate(-90, 0, 0, 1);
        this.craneJib.draw(textureShaderInfo, elapsed, modelMatrix);

        //Crane Tower Peak --------------------- SIDE B
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 0, 0);
        modelMatrix.rotate(30, 0, 0, 1);
        modelMatrix.scale(1, 1, 1);
        this.craneTowerPeak.draw(textureShaderInfo, elapsed, modelMatrix);

        //Wire bak
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-12, 6, 1);
        modelMatrix.rotate(-40, 0, 0, 1);
        modelMatrix.scale(.1, 7, .1);
        this.wire.draw(textureShaderInfo, elapsed, modelMatrix);

        //Wire bak
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-12, 6, -1);
        modelMatrix.rotate(-40, 0, 0, 1);
        modelMatrix.scale(.1, 7, .1);
        this.wire.draw(textureShaderInfo, elapsed, modelMatrix);

        //Wire fremme --------------------- SIDE C
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(11, 7, 1);
        modelMatrix.rotate(72, 0, 0, 1);
        modelMatrix.scale(.1, 18, .1);
        this.wire.draw(textureShaderInfo, elapsed, modelMatrix);

        //Wire fremme -------------------- SIDE C
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(11, 7, -1);
        modelMatrix.rotate(72, 0, 0, 1);
        modelMatrix.scale(.1, 18, .1);
        this.wire.draw(textureShaderInfo, elapsed, modelMatrix);

        //Tømmer stacken ...:
        this.stack.empty();
    }
}


