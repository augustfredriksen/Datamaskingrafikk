'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import {CompositeFigure} from "./CompositeFigure.js";

/**
 * Klasse som implementerer en sammensatt figur.
 */
export class CompositeCompositeFigure {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.compositeFigure1 = new CompositeFigure(this.app);

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
    draw(shaderInfo, texturedShaderInfo, elapsed, modelMatrix = new Matrix4()) {
        modelMatrix.setIdentity();

        // Tegner:
        modelMatrix.translate(0, 0, 0);
        modelMatrix.scale(.5, .5, .5);
        this.compositeFigure1.draw(shaderInfo, texturedShaderInfo, elapsed, modelMatrix);
    }
}


