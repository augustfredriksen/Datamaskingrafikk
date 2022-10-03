import {BaseApp} from '../../base/BaseApp.js';
import {Cone} from '../../base/shapes/Cone.js';
import {Cube} from '../../base/shapes/Cube.js';
import {Circle} from '../../base/shapes/Circle.js';


export class Oblig1 extends BaseApp {
	
	

	constructor() {
		super(true);
		//  Kjegle:
		this.cone = new Cone(this);
		this.cone.initBuffers();

		// Kube:
		this.cube = new Cube(this);
		this.cube.initBuffers();

		// Sirkel:
		this.circle = new Circle(this);
		this.circle.initBuffers();
	}

	

	draw(
		elapsed,
		modelMatrix = new Matrix4(), 
		cubeMatrix = new Matrix4(),
		circleMatrix = new Matrix4(),
		) {
		const MAX = 20;
		super.draw(elapsed);

		modelMatrix.setIdentity();
		cubeMatrix.scale(MAX, MAX, MAX);
		circleMatrix.translate(5, 1, 2);
		
		this.cone.draw(this.baseShaderInfo, elapsed, modelMatrix);
		this.circle.draw(this.baseShaderInfo, elapsed, circleMatrix);
		this.circle.draw(this.baseShaderInfo, elapsed, modelMatrix);
		this.cube.draw(this.baseShaderInfo, elapsed, cubeMatrix);
	}

	
}
