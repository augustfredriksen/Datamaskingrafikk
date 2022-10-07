'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import { OperatorRoom } from '../../base/shapes/CraneOperatorRoom.js';
import { Winch } from '../../base/shapes/CraneWinch.js';
import { Wire } from '../../base/shapes/CraneWire.js';
import { CraneCounterJib } from '../Cranes/CraneCounterJib.js';
import { CraneJib } from '../Cranes/CraneJib.js';
import { CraneTowerPeak } from '../Cranes/CraneTowerPeak.js';
import { CompositeRotateThing } from '../RotateThing.js';
import { JibPart } from './JibPart.js';


/**
 * Klasse som implementerer en sammensatt figur.
 */
export class TopPart {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.craneJib = new CraneJib(this.app);
        this.craneTowerPeak = new CraneTowerPeak(this.app);
        this.wire = new Wire(this.app);
        this.wire.initBuffers();
        this.compositeRotateThing = new CompositeRotateThing(this.app);
        this.operatorRoom = new OperatorRoom(this.app);
        this.operatorRoom.initBuffers();
        this.craneCounterJib = new CraneCounterJib(this.app);
        this.winch = new Winch(this.app);
        this.winch.initBuffers();
        this.jibPart = new JibPart(this.app);


        this.translationX = 0;
        this.rotateY = 0;
    }

    handleKeys(elapsed) {
        // Dersom ev. del-figur skal animeres håndterer den det selv.
        //this.cone.handleKeys(elapsed);
        // Flytter hele figuren:
        this.jibPart.handleKeys(elapsed);
        if (this.app.currentlyPressedKeys[89]) {    //Y
            this.translationX = this.translationX + 1*elapsed;
        }
        if (this.app.currentlyPressedKeys[85]) {    //U
            this.translationX = this.translationX - 1*elapsed;
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

        //Rotasjonsdisk -- Under Operator Room
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 33, 0);
        modelMatrix.rotate(90, 1, 0, 0);
        modelMatrix.scale(2, 2, 0.5);
        this.compositeRotateThing.draw(textureShaderInfo, elapsed, modelMatrix);


        //Operator Room
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 36, 0);
        modelMatrix.rotate(90, 1, 0, 0);
        modelMatrix.scale(2, 2, 2);
        this.operatorRoom.draw(textureShaderInfo, elapsed, modelMatrix);

        //Jib Part
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 35, 0);
        modelMatrix.rotate(0, 0, 0, 1);
        modelMatrix.scale(1, 1, 1);
        this.jibPart.draw(textureShaderInfo, elapsed, modelMatrix);

        //Crane Winch
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-15, 37, 0);
        modelMatrix.rotate(0, 0, 0, 1);
        modelMatrix.scale(1, 1, 2);
        this.winch.draw(textureShaderInfo, elapsed, modelMatrix);

        //Crane Counter Jib
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 35, 0);
        modelMatrix.rotate(90, 0, 0, 1);
        modelMatrix.scale(1, 1, 1);
        this.craneCounterJib.draw(textureShaderInfo, elapsed, modelMatrix);

        //Tømmer stacken ...:
        this.stack.empty();
    }
}


