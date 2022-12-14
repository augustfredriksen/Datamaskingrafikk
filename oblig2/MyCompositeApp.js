import {BaseApp} from '../../base/BaseApp.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';
import {HoistingCrane} from './HoistingCrane.js';
import {XZPlane} from "../../base/shapes/XZPlane.js";

/**
 * Klassen representerer en WebGL-app som tegner en sammensatt fiigur.
 */
export class MyCompositeApp extends BaseApp {

	constructor() {
		super();
		this.hoistingCrane = new HoistingCrane(this);

		this.xzplane = new XZPlane(this);
		this.xzplane.initBuffers();
	}

	initShaders() {
		super.initShaders();    //NB!

		// Texture shader:
		let vertexShaderSource = document.getElementById('texture-vertex-shader').innerHTML;
		let fragmentShaderSource = document.getElementById('texture-fragment-shader').innerHTML;
		// Initialiserer  & kompilerer shader-programmene;
		const glslTextureShader = new WebGLShader(this.gl, vertexShaderSource, fragmentShaderSource);
		// Samler all texture-shader-info i et JS-objekt.
		this.textureShaderInfo = {
			program: glslTextureShader.shaderProgram,
			attribLocations: {
				vertexPosition: this.gl.getAttribLocation(glslTextureShader.shaderProgram, 'aVertexPosition'),
				vertexColor: this.gl.getAttribLocation(glslTextureShader.shaderProgram, 'aVertexColor'),
				vertexTextureCoordinate: this.gl.getAttribLocation(glslTextureShader.shaderProgram, 'aVertexTextureCoordinate'),
			},
			uniformLocations: {
				sampler: this.gl.getUniformLocation(glslTextureShader.shaderProgram, 'uSampler'),
				projectionMatrix: this.gl.getUniformLocation(glslTextureShader.shaderProgram, 'uProjectionMatrix'),
				modelViewMatrix: this.gl.getUniformLocation(glslTextureShader.shaderProgram, 'uModelViewMatrix'),
			},
		};
	}

	/**
	 * Håndterer brukerinput.
	 */
	handleKeys(elapsed) {
		super.handleKeys(elapsed);
		this.hoistingCrane.handleKeys(elapsed);
	}

	/**
	 * Animerer og tegner ...
	 */
	draw(elapsed, modelMatrix = new Matrix4()) {
		super.draw(elapsed);
		modelMatrix.scale(5, 5, 5)
		this.xzplane.draw(this.textureShaderInfo, elapsed, modelMatrix);
		this.hoistingCrane.draw(this.baseShaderInfo, this.textureShaderInfo, elapsed, modelMatrix);
	}
}
