import {WebGLCanvas} from '../../base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';

/**
 * Et WebGL-program som tegner en enkel trekant.
 * Bruker ikke klasser, kun funksjoner.
 */
 export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 960, 640);
	let gl = webGLCanvas.gl;
	let baseShaderInfo = initBaseShaders(gl);
	let coordBuffer = initCoordBuffers(gl);
	let arrowBuffer = initArrowBuffers(gl);
	draw(gl, baseShaderInfo, coordBuffer, arrowBuffer);
}

function initBaseShaders(gl) {
	// Leser shaderkode fra HTML-fila: Standard/enkel shader (posisjon og farge):
	let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

	// Initialiserer  & kompilerer shader-programmene;
	const glslShader = new WebGLShader(gl, vertexShaderSource, fragmentShaderSource);

	// Samler all shader-info i ET JS-objekt, som returneres.
	return  {
		program: glslShader.shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexColor'),
		},
		uniformLocations: {
			//.. ikke i bruk
		},
	};
}

function initCoordBuffers(gl) {
	const MAX = 1
	const positions = new Float32Array([
		MAX, 0, 0,    // x-akse
		-MAX, 0, 0,   // x-akse

		0, MAX, 0,    // y-akse
		0, -MAX, 0,   // y-akse

		0, 0, MAX,    // z-akse
		0, 0, -MAX,   // z-akse
	]);
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	const colors = new Float32Array([

		1, 0, 0, 1,
		1, 0, 0, 1,

		0, 1, 0, 1,
		0, 1, 0, 1,

		0, 0, 1, 1,
		0, 0, 1, 1,

	]);
	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		vertexCount: positions.length/3
	};
}

function initArrowBuffers(gl) {
	const MAX = 1
	const positions = new Float32Array([
		0.8, 0.0, 0.0,
		0.3, 0.6, 0.0,
		0.3, -0.6, 0.0,

		-0.3, -0.3, 0.0,
		0.3, -0.3, 0.0,
		0.3, 0.3, 0.0,

		-0.3, 0.3, 0.0,
		-0.3, -0.3, 0.0,
		0.3, 0.3, 0.0,

		-0.3, 0.3, 0.0,
		-0.3, -0.3, 0.0,
		-0.8, 0.3, 0.0,

		-0.3, 0.3, 0.0,
		-0.3, -0.3, 0.0,
		-0.8, -0.3, 0.0,
	]);
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	const colors = new Float32Array([

		0, 0, 1, 1,
		0, 0, 1, 1,
		0, 0, 1, 1,

		0, 0, 1, 1,
		0, 0, 1, 1,
		0, 0, 1, 1,

		0, 0, 1, 1,
		0, 0, 1, 1,
		0, 0, 1, 1,

		0, 0, 1, 1,
		0, 0, 1, 1,
		0, 0, 1, 1,

		0, 0, 1, 1,
		0, 0, 1, 1,
		0, 0, 1, 1,

	]);
	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		vertexCount: positions.length/3
	};
}

/**
 * Aktiverer position-bufferet.
 * Kalles fra draw()
 */
function connectPositionAttribute(gl, baseShaderInfo, positionBuffer) {
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(
		baseShaderInfo.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShaderInfo.attribLocations.vertexPosition);
}

function connectColorAttribute(gl, baseShaderInfo, colorBuffer) {
	const numComponents = 4;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(
		baseShaderInfo.attribLocations.vertexColor,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShaderInfo.attribLocations.vertexColor);
}

/**
 * Klargjør canvaset.
 * Kalles fra draw()
 */
function clearCanvas(gl) {
	gl.clearColor(0.9, 0.9, 0.9, 1);  // Clear screen farge.
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);           // Enable "depth testing".
	gl.depthFunc(gl.LEQUAL);            // Nære objekter dekker fjerne objekter.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


/**
 * Tegner!
 */
function draw(gl, baseShaderInfo, coordBuffers, arrowBuffers) {
	clearCanvas(gl);

	gl.useProgram(baseShaderInfo.program);

	connectPositionAttribute(gl, baseShaderInfo, arrowBuffers.position);
	connectColorAttribute(gl, baseShaderInfo, arrowBuffers.color);
	gl.drawArrays(gl.TRIANGLES, 0, arrowBuffers.vertexCount);

	connectPositionAttribute(gl, baseShaderInfo, coordBuffers.position);
	connectColorAttribute(gl, baseShaderInfo, coordBuffers.color);
	gl.drawArrays(gl.LINES, 0, coordBuffers.vertexCount);

	
}
