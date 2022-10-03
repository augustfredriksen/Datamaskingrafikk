'use strict';
import {BaseShape} from './BaseShape.js';
/**
 * Setter this.positions & this.colors.
 * Tegnes vha. gl.TRIANGLE_FAN
 */
export class Circle extends BaseShape {
    constructor(app, color = {red:0.1, green:0.1, blue:0.1, alpha:1}, sectors=36) {
        super(app);
        this.color = color;
        this.sectors = sectors;
    }
    

    createVertices() {
        
        super.createVertices();

        this.positions = []
        for (var i = 0.0; i <= 360; i++) {
      // degrees to radians
      var j = i * Math.PI / 180;
      // X Y Z
      var vert1 = [
        Math.cos(j),
        Math.sin(j),
      ];
      this.positions = this.positions.concat(vert1);


        }

        function randomColor() {
            return [Math.random(), Math.random(), Math.random(), 1.0];
        }
        

        this.colors = [];
        for (let face = 0; face < 360; face++) {
        let faceColor = [0, 0, 1.0, 1];
            this.colors.push(...randomColor());
    }
        
        



    }

    draw(shaderInfo, elapsed, modelMatrix = (new Matrix4()).setIdentity()) {
        super.draw(shaderInfo, elapsed, modelMatrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexCount);
    }
}


