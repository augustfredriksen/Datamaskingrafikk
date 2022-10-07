'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import { Scaffold } from './Scaffold.js';

/**
 * Klasse som implementerer en sammensatt figur.
 */
export class CraneMast {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.scaffold = new Scaffold(app);

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

        //Stillasparti -- Vertikalt
        for (let i = 0; i <= 8; i++) {
            modelMatrix = this.stack.peekMatrix();
            modelMatrix.translate(0, i*4, 0);
            modelMatrix.scale(1, 1, 1);
            this.scaffold.draw(textureShaderInfo, elapsed, modelMatrix);
        }

        //Tømmer stacken ...:
        this.stack.empty();
    }
}


