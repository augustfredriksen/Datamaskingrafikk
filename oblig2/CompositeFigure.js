'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import { Scaffold } from './Cranes/Scaffold.js';
import { CompositeRotateThing } from './RotateThing.js';
import { OperatorRoom } from '../base/shapes/CraneOperatorRoom.js';
import { Wire } from '../base/shapes/CraneWire.js';
import { CraneMast } from './Cranes/CraneMast.js';
import { CraneJib } from './Cranes/CraneJib.js';
import { CraneTowerPeak } from './Cranes/CraneTowerPeak.js';
import { CraneCounterJib } from './Cranes/CraneCounterJib.js';
import { BottomPart } from './Parts/BottomPart.js';
import { JibPart } from './Parts/JibPart.js';
import { Winch } from '../base/shapes/CraneWinch.js';


/**
 * Klasse som implementerer en sammensatt figur.
 */
export class CompositeFigure {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.bottomPart = new BottomPart(this.app);
        this.jibPart = new JibPart(this.app);

        this.scaffold = new Scaffold(this.app);
        this.craneMast = new CraneMast(this.app);
        this.craneJib = new CraneJib(this.app);
        this.craneTowerPeak = new CraneTowerPeak(this.app);
        this.craneCounterJib = new CraneCounterJib(this.app);

        this.winch = new Winch(this.app);
        this.winch.initBuffers();

        this.compositeRotateThing = new CompositeRotateThing(this.app);
        


        this.operatorRoom = new OperatorRoom(this.app);
        this.operatorRoom.initBuffers();

        this.wire = new Wire(app);
        this.wire.initBuffers();

        this.translationX = 0;
    }

    handleKeys(elapsed) {
        // Dersom ev. del-figur skal animeres håndterer den det selv.
        // Flytter hele figuren:
        this.bottomPart.handleKeys(elapsed);
        if (this.app.currentlyPressedKeys[89]) {    //Y
            this.translationX = this.translationX + 1*elapsed;
        }
        if (this.app.currentlyPressedKeys[85]) {    //U
            this.translationX = this.translationX - 1*elapsed;
        }
    }

    //MERK: Kaller ikke super.draw() siden klassen ikke arver fra BaseShape:
    draw(shaderInfo, textureShaderInfo, elapsed, modelMatrix = new Matrix4()) {

        this.stack.pushMatrix(modelMatrix);	 	//Legges på toppen av stacken.
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 0, 0);
        modelMatrix.rotate(0, 1, 0, 0);
        modelMatrix.scale(1, 1, 1);
        this.bottomPart.draw(textureShaderInfo, elapsed, modelMatrix);

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

        //Wire Heise
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(28, 20, 0);
        modelMatrix.rotate(0, 0, 0, 1);
        modelMatrix.scale(.1, 14, .1);
        this.wire.draw(textureShaderInfo, elapsed, modelMatrix);

        //Magnet
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(28, 6, 0);
        modelMatrix.rotate(this.translationX*60 + 90, 1, 0, 0);
        modelMatrix.scale(2, 2, .4);
        this.compositeRotateThing.draw(textureShaderInfo, elapsed, modelMatrix);



        //Tømmer stacken ...:
        this.stack.empty();
    }
}


