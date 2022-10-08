'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import {HoistingCraneComposition} from "./HoistingCraneComposition.js";

/**
 * Klasse som implementerer en sammensatt figur.
 */
export class HoistingCrane {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.hoistingCraneComposition = new HoistingCraneComposition(this.app);

        this.translationX = 0;
    }

    handleKeys(elapsed) {
        // Dersom ev. del-figur skal animeres håndterer den det selv.
        //this.cone.handleKeys(elapsed);
        // Flytter hele figuren:
        this.hoistingCraneComposition.handleKeys(elapsed);
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
        modelMatrix.translate(10 -this.translationX*2, 0, 10);
        modelMatrix.scale(.5, .5, .5);
        this.hoistingCraneComposition.draw(shaderInfo, texturedShaderInfo, elapsed, modelMatrix);
    }
}


