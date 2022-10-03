import {WebGLCanvas} from '../../base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';

/**
 * Et WebGL-program som tegner en enkel trekant.
 * Bruker ikke klasser, kun funksjoner.
 */
export function main() {
	// Oppretter et webGLCanvas for WebGL-tegning:
	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 960, 640);
	const gl = webGLCanvas.gl;
	let baseShaderInfo = initBaseShaders(gl);
	let pointBuffers = initPointBuffers(gl);
	let lineBuffers = initLineBuffers(gl);
	let stripLineBuffers = initStripLineBuffers(gl);
	let triangleStripBuffers = initTriangleStripBuffers(gl);
	draw(gl, baseShaderInfo, pointBuffers, lineBuffers, stripLineBuffers, triangleStripBuffers);
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
			projectionMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uModelViewMatrix'),
		},
	};
}

/**
 * Genererer view- og projeksjonsmatrisene.
 * Disse utgjør tilsanmmen det virtuelle kameraet.
 */
function initCamera(gl) {
	// Kameraposisjon:
	const camPosX = 0;
	const camPosY = 0;
	const camPosZ = 10;

	// Kamera ser mot ...
	const lookAtX = 0;
	const lookAtY = 0;
	const lookAtZ = 0;

	// Kameraorientering:
	const upX = 0;
	const upY = 1;
	const upZ = 0;

	let viewMatrix = new Matrix4();
	let projectionMatrix = new Matrix4();

	// VIEW-matrisa:
	viewMatrix.setLookAt(camPosX, camPosY, camPosZ, lookAtX, lookAtY, lookAtZ, upX, upY, upZ);
	// PROJECTION-matrisa (frustum): cuon-utils: Matrix4.prototype.setPerspective = function(fovy, aspect, near, far)
	const fieldOfView = 45; // I grader.
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const near = 0.1;
	const far = 1000.0;
	// PROJEKSJONS-matrisa; Bruker cuon-utils: Matrix4.prototype.setPerspective = function(fovy, aspect, near, far)
	projectionMatrix.setPerspective(fieldOfView, aspect, near, far);

	return {
		viewMatrix: viewMatrix,
		projectionMatrix: projectionMatrix
	};
}

/**
 * Oppretter verteksbuffer for trekanten.
 * Et posisjonsbuffer og et fargebuffer.
 * MERK: Må være likt antall posisjoner og farger.
 */

function randomPoints(n) {
	let points = [];
	for(let i = 0; i < n; i++) {
		const r = () => Math.random();
		const inputPoint = [r(), r(), r()];
		points.push(...inputPoint);
	}
	return points
}
function initPointBuffers(gl) {
	const positions = randomPoints(10);
	const colors = new Float32Array([
		1, 0.3, 0, 1,   //R G B A
		1, 0.3, 0, 1,   //R G B A
		1, 0.3, 0, 1,   //R G B A
		1, 0.3, 0, 1,   //R G B A
		1, 0.3, 0, 1,   //R G B A
		1, 0.3, 0, 1,   //R G B A
		1, 0.3, 0, 1,   //R G B A
		1, 0.3, 0, 1,   //R G B A
		1, 0.3, 0, 1,   //R G B A
		1, 0.3, 0, 1,   //R G B A
	]);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

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

function initLineBuffers(gl) {
	const positions = new Float32Array([
		5.0, 2.0, 0.0,
		5.0, -2.0, 0.0,

		6.0, 2.0, 0.0,
		6.0, -2.0, 0.0,

	]);
	const colors = new Float32Array([

		1, 0.3, 0, 1,   	//R G B A
		1, 0.3, 0, 1,   	//R G B A
		0.0, 0.3, 0.5, 1,   //R G B A
		0.0, 0.3, 0.5, 1,   //R G B A

	]);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

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

function initStripLineBuffers(gl) {
	const positions = new Float32Array([
		2.0, 1.0, 0.0,
		2.0, -1.0, 0.0,

		3.0, 3.0, 0.0,
		3.0, -3.0, 0.0,

		4.0, 2.0, 0.0,
		4.0, -2.0, 0.0,

	]);
	const colors = new Float32Array([

		1, 0.3, 0, 1,   	//R G B A
		1, 0.3, 0, 1,   	//R G B A
		0.0, 0.3, 0.5, 1,   //R G B A
		0.0, 0.3, 0.5, 1,   //R G B A
		0.8, 0.3, 0.5, 1,   //R G B A
		0.8, 0.3, 0.5, 1,   //R G B A

	]);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

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

function initTriangleStripBuffers(gl) {
	const positions = new Float32Array([
		-3.0, -5.0, 0.0,
		-2.0, -1.0, 0.0,
		0.0, -5.0, 0.0,
		1.0, -1.0, 0.0,
		2.0, -5.0, 0.0,




	]);
	const colors = new Float32Array([

		1, 0.0, 0, 1,   	//R G B A
		0.0, 1.0, 0, 1, 
		0.0, 0.0, 1, 1,  	//R G B A
		1, 0.0, 0.0, 1,
		0.0, 1, 0.0, 1,


	]);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

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

/**
 * Aktiverer color-bufferet.
 * Kalles fra draw()
 */
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
function draw(gl, baseShaderInfo, pointBuffers, lineBuffers, stripLineBuffers, triangleStripBuffers) {
	clearCanvas(gl);

	// Aktiver shader:
	gl.useProgram(baseShaderInfo.program);

	// Kople posisjon og farge-attributtene til tilhørende buffer:
	

	// Lag viewmodel-matrisa:
	let modelMatrix = new Matrix4();
	modelMatrix.setIdentity();
	modelMatrix.translate(-3, 1,0);
	modelMatrix.rotate(0, 0,0,1);

	let cameraMatrixes = initCamera(gl);
	let modelviewMatrix = new Matrix4(cameraMatrixes.viewMatrix.multiply(modelMatrix)); // NB! rekkefølge!


	gl.uniformMatrix4fv(baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	gl.uniformMatrix4fv(baseShaderInfo.uniformLocations.projectionMatrix, false, cameraMatrixes.projectionMatrix.elements);
	connectPositionAttribute(gl, baseShaderInfo, pointBuffers.position);
	connectColorAttribute(gl, baseShaderInfo, pointBuffers.color);
	gl.drawArrays(gl.POINTS, 0, pointBuffers.vertexCount);

	connectPositionAttribute(gl, baseShaderInfo, lineBuffers.position);
	connectColorAttribute(gl, baseShaderInfo, lineBuffers.color);
	gl.drawArrays(gl.LINES, 0, lineBuffers.vertexCount);

	connectPositionAttribute(gl, baseShaderInfo, stripLineBuffers.position);
	connectColorAttribute(gl, baseShaderInfo, stripLineBuffers.color);
	gl.drawArrays(gl.LINE_STRIP, 0, stripLineBuffers.vertexCount);

	connectPositionAttribute(gl, baseShaderInfo, triangleStripBuffers.position);
	connectColorAttribute(gl, baseShaderInfo, triangleStripBuffers.color);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, triangleStripBuffers.vertexCount);
}
