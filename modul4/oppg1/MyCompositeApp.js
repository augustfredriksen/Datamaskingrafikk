import {BaseApp} from '../../base/BaseApp.js';
import {CompositeFigure} from './CompositeFigure.js';
import {XZPlane} from "../../base/shapes/XZPlane.js";

/**
 * Klassen representerer en WebGL-app som tegner en sammensatt fiigur.
 */
export class MyCompositeApp extends BaseApp {

	constructor() {
		super();
		this.compositeFigure = new CompositeFigure(this);
		this.xzplane = new XZPlane(this);
		this.xzplane.initBuffers();
	}

	/**
	 * Håndterer brukerinput.
	 */
	handleKeys(elapsed) {
		super.handleKeys(elapsed);
		this.compositeFigure.handleKeys(elapsed);
	}

	/**
	 * Animerer og tegner ...
	 */
	draw(elapsed, modelMatrix = new Matrix4()) {
		super.draw(elapsed);
		this.xzplane.draw(this.baseShaderInfo, elapsed, modelMatrix);
		this.compositeFigure.draw(this.baseShaderInfo, elapsed, modelMatrix);
	}
}
