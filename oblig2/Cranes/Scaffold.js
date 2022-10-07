'use strict';
/*
    buffer og draw for PaperMan
*/
import {Stack} from '../../base/helpers/Stack.js';
import {Pipe} from '../../base/shapes/CranePipe.js';
import { Sphere } from '../../base/shapes/CraneSphere.js';

/**
 * Klasse som implementerer en sammensatt figur.
 */
export class Scaffold {

    constructor(app) {
        this.app = app;

        this.stack = new Stack();

        this.pipe = new Pipe(app);
        this.pipe.initBuffers();

        this.sphere = new Sphere(app);
        this.sphere.initBuffers();

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
        const sphereScale = .05;
        const pipeScale = .1;

        const pipeHeight = 4;
        const pipeWidth = 2;
        const hypotenus = Math.sqrt(pipeHeight**2 + pipeWidth**2);
        const pipeAngle = (Math.asin(pipeHeight/hypotenus) / Math.PI) * 180;


        this.stack.pushMatrix(modelMatrix);	 	//Legges på toppen av stacken.


        // ---------------------VINKELRETTE RØR og KULER--------------------------
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(1, 1, -1);
        modelMatrix.scale(pipeScale, pipeHeight, pipeScale);
        modelMatrix.rotate(-90, 1, 0, 0)
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(1, 5, -1);
        modelMatrix.scale(sphereScale, sphereScale, sphereScale);
        this.sphere.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(1, 1, 1);
        modelMatrix.scale(pipeScale, pipeHeight, pipeScale);
        modelMatrix.rotate(-90, 1, 0, 0)
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(1, 5, 1);
        modelMatrix.scale(sphereScale, sphereScale, sphereScale);
        this.sphere.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-1, 1, 1);
        modelMatrix.scale(pipeScale, pipeHeight, pipeScale);
        modelMatrix.rotate(-90, 1, 0, 0)
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-1, 5, 1);
        modelMatrix.scale(sphereScale, sphereScale, sphereScale);
        this.sphere.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-1, 1, -1);
        modelMatrix.scale(pipeScale, pipeHeight, pipeScale);
        modelMatrix.rotate(-90, 1, 0, 0)
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-1, 5, -1);
        modelMatrix.scale(sphereScale, sphereScale, sphereScale);
        this.sphere.draw(textureShaderInfo, elapsed, modelMatrix);

        // ---------------------SKRÅ RØR--------------------------
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-1, 1, -1);
        modelMatrix.rotate(-pipeAngle, 1, 0, 0) //Vinkel
        modelMatrix.scale(pipeScale, pipeScale, hypotenus); //Hypotenus 
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-1, 1, 1);
        modelMatrix.rotate(-90, 0, -1, 0) //Vinkel
        modelMatrix.rotate(-pipeAngle, 1, 0, 0) //Vinkel
        modelMatrix.scale(pipeScale, pipeScale, hypotenus); //Hypotenus 
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(1, 1, 1);
        modelMatrix.rotate(pipeAngle, 1, 0, 0) //Vinkel
        modelMatrix.scale(pipeScale, pipeScale, -hypotenus); //Hypotenus 
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(1, 1, -1);
        modelMatrix.rotate(-90, 0, 1, 0) //Vinkel
        modelMatrix.rotate(-pipeAngle, 1, 0, 0) //Vinkel
        modelMatrix.scale(pipeScale, pipeScale, hypotenus); //Hypotenus 
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);


        // ---------------------LIGGENDE RØR--------------------------
        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(1, 5, -1);
        modelMatrix.scale(pipeScale, pipeScale, pipeWidth);
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-1, 5, -1);
        modelMatrix.scale(pipeScale, pipeScale, pipeWidth);
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-1, 5, -1);
        modelMatrix.rotate(90, 0, 1, 0);
        modelMatrix.scale(pipeScale, pipeScale, pipeWidth);
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        modelMatrix = this.stack.peekMatrix();
        modelMatrix.translate(-1, 5, 1);
        modelMatrix.rotate(90, 0, 1, 0);
        modelMatrix.scale(pipeScale, pipeScale, pipeWidth);
        this.pipe.draw(textureShaderInfo, elapsed, modelMatrix);

        //Tømmer stacken ...:
        this.stack.empty();
    }
}


