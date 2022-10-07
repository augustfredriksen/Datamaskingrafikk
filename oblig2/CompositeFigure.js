'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import {Platform} from '../../base/shapes/CranePlatform.js';
import {Pipe} from '../../base/shapes/CranePipe.js';
import {Sphere} from '../../base/shapes/CraneSphere.js';
import { CompositeWheel } from './Wheels.js';
import { Scaffold } from './Scaffold.js';
import { CompositeRotateThing } from './RotateThing.js';
import { OperatorRoom } from '../base/shapes/CraneOperatorRoom.js';

/**
 * Klasse som implementerer en sammensatt figur.
 */
export class CompositeFigure {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.platform = new Platform(app);
        this.platform.initBuffers();

        this.pipe = new Pipe(app);
        this.pipe.initBuffers();

        this.sphere = new Sphere(app);
        this.sphere.initBuffers();

        this.compositeWheel = new CompositeWheel(this.app);

        this.scaffold = new Scaffold(this.app);

        this.compositeRotateThing = new CompositeRotateThing(this.app);

        this.operatorRoom = new OperatorRoom(this.app);
        this.operatorRoom.initBuffers();

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
    draw(shaderInfo, textureShaderInfo, elapsed, modelMatrix = new Matrix4()) {

        this.stack.pushMatrix(modelMatrix);	 	//Legges på toppen av stacken.

        //Platform -- Bunnparti
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 1, 0);
        modelMatrix.scale(6, 0.4, 3);
        this.platform.draw(textureShaderInfo, elapsed, modelMatrix);


        //Dekk og felg -- Høyre fremhjul
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(4, 0.7, 3.5);
        modelMatrix.scale(0.7, 0.7, 0.3);
        this.compositeWheel.draw(textureShaderInfo, elapsed, modelMatrix);

        //Dekk og felg -- Høyre bakhjul
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-4, 0.7, -3.5);
        modelMatrix.scale(0.7, 0.7, 0.3);
        modelMatrix.rotate(180, 0, 1, 0);
        this.compositeWheel.draw(textureShaderInfo, elapsed, modelMatrix);

        //Dekk og felg -- Venstre fremhjul
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(4, 0.7, -3.5);
        modelMatrix.scale(0.7, 0.7, 0.3);
        modelMatrix.rotate(180, 0, 1, 0);
        this.compositeWheel.draw(textureShaderInfo, elapsed, modelMatrix);

        //Dekk og felg -- Venstre bakhjul
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-4, 0.7, 3.5);
        modelMatrix.scale(0.7, 0.7, 0.3);
        this.compositeWheel.draw(textureShaderInfo, elapsed, modelMatrix);

        //Stillasparti -- Vertikalt
        for (let i = 0; i <= 8; i++) {
            modelMatrix = this.stack.peekMatrix();
            modelMatrix.translate(0, i*4, 0);
            modelMatrix.scale(1, 1, 1);
            this.scaffold.draw(textureShaderInfo, elapsed, modelMatrix);
        }


        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 33, 0);
        modelMatrix.rotate(90, 1, 0, 0)
        modelMatrix.scale(2, 2, 0.5);
        this.compositeRotateThing.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(0, 36, 0);
        modelMatrix.rotate(90, 1, 0, 0)
        modelMatrix.scale(2, 2, 2);
        this.operatorRoom.draw(textureShaderInfo, elapsed, modelMatrix);

        for (let i = 0; i < 5; i++) {
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(i*3, 36 + i*3, 0);
        modelMatrix.rotate(-45, 0, 0, 1);
        modelMatrix.scale(1, 1, 1);
        this.scaffold.draw(textureShaderInfo, elapsed, modelMatrix);
        }

        for (let i = 0; i < 4; i++) {
            modelMatrix = this.stack.peekMatrix();
            modelMatrix.translate(-i*3, 35 + i*3, 0);
            modelMatrix.rotate(45, 0, 0, 1);
            modelMatrix.scale(1, 1, 1);
            this.scaffold.draw(textureShaderInfo, elapsed, modelMatrix);
            }

        for (let i = 0; i < 6; i++) {
            modelMatrix = this.stack.peekMatrix();
            modelMatrix.translate(-i*3, 35, 0);
            modelMatrix.rotate(90, 0, 0, 1);
            modelMatrix.scale(1, 1, 1);
            this.scaffold.draw(textureShaderInfo, elapsed, modelMatrix);
            }



        //Tømmer stacken ...:
        this.stack.empty();
    }
}


