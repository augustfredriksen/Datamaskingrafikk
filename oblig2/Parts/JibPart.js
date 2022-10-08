'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import { Wire } from '../../base/shapes/CraneWire.js';
import { CraneJib } from '../Cranes/CraneJib.js';
import { CraneTowerPeak } from '../Cranes/CraneTowerPeak.js';
import { CompositeRotateThing } from './RotateThing.js';


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
        this.compositeRotateThing = new CompositeRotateThing(this.app);

        this.translationX = 0;
        this.rotateY = 0;
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

        if (this.app.currentlyPressedKeys[40]) {    //pil ned
            this.rotateY = this.rotateY - 1*elapsed;
            if(this.rotateY <= 0) {
                this.rotateY = 0;
            }
        }

        if (this.app.currentlyPressedKeys[38]) {    //pil opp
            this.rotateY = this.rotateY + 1*elapsed;
            if(this.rotateY >= 0.90) {
                this.rotateY = 0.90;
            }
            console.log(this.rotateY);
        }
    }

    //MERK: Kaller ikke super.draw() siden klassen ikke arver fra BaseShape:
    draw(textureShaderInfo, elapsed, modelMatrix = new Matrix4()) {
        // a^2 = b^2 + c^2 - 2*b*c*cosA
        // c = 29
        // A = 120grader // 2.095 radianer
        // b = 29 * 4 /9 = 116/9 = 12.88
        const wireScaleY = Math.sqrt(Math.pow(116/9, 2) + Math.pow(29, 2) - 2*(116/9)*29*Math.cos(120*Math.PI/180));

        const platformWidth = 4;
        const platformLength = 8;
        const platformHeight = 1;
        const wheelRadius = 1.4;
        const wheelWidth = 0.4;
        const wheelPosZ = platformWidth + 2*wheelWidth;
        const wheelPosX = platformLength / 1.8;
        const wheelPosY = platformHeight * 1.2;

        this.stack.pushMatrix(modelMatrix);	 	//Legges på toppen av stacken.

        //Crane Jib ---------------------- SIDE a
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 0, 0);
        modelMatrix.scale(1, 1, 1);
        modelMatrix.rotate(-90 + this.rotateY*60, 0, 0, 1);
        this.craneJib.draw(textureShaderInfo, elapsed, modelMatrix);

        //Crane Tower Peak --------------------- SIDE b
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

        //Wire fremme --------------------- SIDE c
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(11 - this.rotateY*6, 7 + this.rotateY*11, 1);
        modelMatrix.rotate(72 + this.rotateY*60, 0, 0, 1);
        modelMatrix.scale(.1, wireScaleY/2 - this.rotateY*6, .1);
        this.wire.draw(textureShaderInfo, elapsed, modelMatrix);

        //Wire fremme -------------------- SIDE c
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(11 - this.rotateY*6, 7 + this.rotateY*11, -1);
        modelMatrix.rotate(72 + this.rotateY*60, 0, 0, 1);
        modelMatrix.scale(.1, wireScaleY/2 - this.rotateY*6, .1);
        this.wire.draw(textureShaderInfo, elapsed, modelMatrix);

        //Wire Heise
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(28 - this.rotateY*12, -14 + this.rotateY*24, 0);
        modelMatrix.rotate(0, 0, 0, 1);
        modelMatrix.scale(.1, 14, .1);
        this.wire.draw(textureShaderInfo, elapsed, modelMatrix);

        //Magnet
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(28 - this.rotateY*12, -28 + this.rotateY*24, 0);
        modelMatrix.rotate(90, 1, 0, 0);
        modelMatrix.scale(2, 2, .4);
        this.compositeRotateThing.draw(textureShaderInfo, elapsed, modelMatrix);

        //Tømmer stacken ...:
        this.stack.empty();
    }
}


