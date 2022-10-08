'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import {Platform} from '../../base/shapes/CranePlatform.js';
import { CompositeWheel } from './Wheels.js';
import { Scaffold } from '../Cranes/Scaffold.js';
import { CraneMast } from '../Cranes/CraneMast.js';


/**
 * Klasse som implementerer en sammensatt figur.
 */
export class BottomPart {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.platform = new Platform(app);
        this.platform.initBuffers();

        this.compositeWheel = new CompositeWheel(this.app);
        this.scaffold = new Scaffold(this.app);
        this.craneMast = new CraneMast(this.app);


        this.translationX = 0;
    }

    handleKeys(elapsed) {
        // Dersom ev. del-figur skal animeres håndterer den det selv.
        //this.cone.handleKeys(elapsed);
        // Flytter hele figuren:
        this.compositeWheel.handleKeys(elapsed);
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

        //Platform -- Bunnparti
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 2, 0);
        modelMatrix.scale(platformLength, platformHeight, platformWidth);
        this.platform.draw(textureShaderInfo, elapsed, modelMatrix);


        //Dekk og felg -- Høyre fremhjul
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(wheelPosX, wheelPosY, wheelPosZ);
        modelMatrix.scale(wheelRadius, wheelRadius, wheelWidth);
        modelMatrix.rotate(this.translationX*60, 0, 0, 1);
        this.compositeWheel.draw(textureShaderInfo, elapsed, modelMatrix);

        //Dekk og felg -- Høyre bakhjul
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-wheelPosX, wheelPosY, -wheelPosZ);
        modelMatrix.scale(wheelRadius, wheelRadius, wheelWidth);
        modelMatrix.rotate(180, 0, 1, 0);
        modelMatrix.rotate(-this.translationX*60, 0, 0, 1);
        this.compositeWheel.draw(textureShaderInfo, elapsed, modelMatrix);

        //Dekk og felg -- Venstre fremhjul
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(wheelPosX, wheelPosY, -wheelPosZ);
        modelMatrix.scale(wheelRadius, wheelRadius, wheelWidth);
        modelMatrix.rotate(180, 0, 1, 0);
        modelMatrix.rotate(-this.translationX*60, 0, 0, 1);
        this.compositeWheel.draw(textureShaderInfo, elapsed, modelMatrix);

        //Dekk og felg -- Venstre bakhjul
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-wheelPosX, wheelPosY, wheelPosZ);
        modelMatrix.scale(wheelRadius, wheelRadius, wheelWidth);
        modelMatrix.rotate(this.translationX*60, 0, 0, 1);
        this.compositeWheel.draw(textureShaderInfo, elapsed, modelMatrix);

        //Stillasparti -- Vertikalt
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 0, 0);
        modelMatrix.scale(1, 1, 1);
        this.craneMast.draw(textureShaderInfo, elapsed, modelMatrix);

        //Tømmer stacken ...:
        this.stack.empty();
    }
}


