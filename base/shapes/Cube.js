'use strict';
import {BaseShape} from './BaseShape.js';
/**
 * Setter this.positions & this.colors.
 * Tegnes vha. gl.TRIANGLE_FAN
 */
export class Cube extends BaseShape {
    constructor(app, color = {red:0.1, green:0.1, blue:0.1, alpha:1}, sectors=12) {
        super(app);
        this.color = color;
        this.sectors = sectors;
    }
    

    createVertices() {
        
        super.createVertices();

        this.positions = [
            		    // Front
			1, 1, 1,
			1, -1, 1,
			-1, 1, 1,
			-1, 1, 1,
			1, -1, 1,
			-1, -1, 1,
		
			// Left
			-1, 1, 1,
			-1, -1, 1,
			-1, 1, -1,
			-1, 1, -1,
			-1, -1, 1,
			-1, -1, -1,
		
			// Back
			-1, 1, -1,
			-1, -1, -1,
			1, 1, -1,
			1, 1, -1,
			-1, -1, -1,
			1, -1, -1,
		
			// Right
			1, 1, -1,
			1, -1, -1,
			1, 1, 1,
			1, 1, 1,
			1, -1, 1,
			1, -1, -1,
		
			// Top
			1, 1, 1,
			1, 1, -1,
			1, 1, 1,
			1, 1, 1,
			1, 1, -1,
			1, 1, -1,
		
			// Bottom
			1, -1, 1,
			1, -1, -1,
			-1, -1, 1,
			-1, -1, 1,
			1, -1, -1,
			-1, -1, -1,
        ];

        function randomColor() {
            return [Math.random(), Math.random(), Math.random(), 1.0];
        }
        

        this.colors = [];
        for (let face = 0; face < 6; face++) {
        let faceColor = randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            this.colors.push(...faceColor);
        }
    }
        
        



    }

    draw(shaderInfo, elapsed, modelMatrix = (new Matrix4()).setIdentity()) {
        super.draw(shaderInfo, elapsed, modelMatrix);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }
}


