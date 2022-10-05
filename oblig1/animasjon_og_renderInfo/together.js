import {WebGLCanvas} from '../../base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';
import {Camera} from "../../base/helpers/Camera.js";



export function main() {

	const webGLCanvas = new WebGLCanvas('myCanvas', document.body, 1920, 1080);

	//SNAKK 1

	const renderInfo = {
		gl: webGLCanvas.gl,
		baseShaderInfo: initBaseShaders(webGLCanvas.gl),
		coordBuffers: initCoordBuffers(webGLCanvas.gl),
		triangleBuffers: initTriangleBuffers(webGLCanvas.gl),
		triangleAnimation: {
			angle: 0,
			rotationsSpeed: 60
		},
		cubeBuffers: initCubeBuffers(webGLCanvas.gl),
		cubeAnimation: {
			angle: 0,
			rotationsSpeed: 60
		},
		circleBuffers: initCircleBuffers(webGLCanvas.gl),
		cylinderBuffers: initCylinderBuffers(webGLCanvas.gl),
		cylinderAnimation: {
			earthRotationAngle: 0,
			earthRotationsSpeed: 60,
			moonRotationAngle: 0,
			moonOrbitAngle: 0,
			moonTranslation: 15,
			moonRotationsSpeed: 300,
			moonOrbitSpeed: 10,
		},
		pointBuffers: initPointBuffers(webGLCanvas.gl),
		pointAnimation: {
			translation: 15,
			speed: 120,
		},
		currentlyPressedKeys: [],
		lastTime: 0,
		fpsInfo: { 
			frameCount: 0,
			lastTimeStamp: 0
		},
		
	};

	initKeyPress(renderInfo.currentlyPressedKeys);
	const camera = new Camera(renderInfo.gl, renderInfo.currentlyPressedKeys);
	animate( 0, renderInfo, camera);
}


function initKeyPress(currentlyPressedKeys) {
	document.addEventListener('keyup', (event) => {
		currentlyPressedKeys[event.which] = false;
	}, false);
	document.addEventListener('keydown', (event) => {
		currentlyPressedKeys[event.which] = true;
	}, false);
}

function initBaseShaders(gl) {
	let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

	const glslShader = new WebGLShader(gl, vertexShaderSource, fragmentShaderSource);

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
//SNAKK 2
function initCoordBuffers(gl) {
	const extent =  100;

	const positions = new Float32Array([
		-extent, 0, 0,
		extent, 0, 0,
		0, -extent, 0,
		0, extent, 0,
		0, 0, -extent,
		0, 0, extent
	]);

	const colors = new Float32Array([
		1, 0, 0, 1,   //R G B A
		1, 0, 0, 1,   //R G B A
		0, 1, 0, 1,   //R G B A
		0, 1, 0, 1,   //R G B A
		0, 0, 1, 1,   //R G B A
		0, 0, 1, 1,   //R G B A
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

function initTriangleBuffers(gl) {
	const extent =  100;

	const positions = new Float32Array([
		0.0, 2.0, 0.0,
		2.0, 0.0, 0.0,
		-2.0, 0.0, 0.0,
	]);

	const colors = new Float32Array([
		0.2, 0.9, 0.4, 1,
		0.2, 0.9, 0.4, 1,
		0.2, 0.9, 0.4, 1,
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

function randomColor() {
	return [Math.random(), Math.random(), Math.random(), 1.0];
}

function initCubeBuffers(gl) {
	const extent =  100;

	const positions = new Float32Array([
		//FRONT
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
	
		
	
		// Bottom
		1, -1, 1,
		1, -1, -1,
		-1, -1, 1,
		-1, -1, 1,
		1, -1, -1,
		-1, -1, -1,

		// Top
		1, 1, 1,
		1, 1, -1,
		-1, 1, 1,
		-1, 1, 1,
		1, 1, -1,
		-1, 1, -1,
	]);

	
	

	let colors = [];
	for (let face = 0; face < 6; face++) {
		let faceColor = randomColor();
		for (let vertex = 0; vertex < 6; vertex++) {
			colors.push(...faceColor);
		}
	}

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		vertexCount: positions.length/3
	};
}

function initCircleBuffers(gl) {
	const random = randomPos();

	let positions = [];
	for (var i = 0.0; i <= 360; i++) {
		var j = i * Math.PI / 180;
		var vert1 = [Math.sin(j) + random - 10, Math.cos(j) + random - 10];
		positions = positions.concat(vert1);
		  }
	let colors = [];
	for (let face = 0; face < 360; face++) {
        let faceColor = [0, 0, 1.0, 1];
            colors.push(...faceColor);
    }

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		vertexCount: positions.length/3
	};
}

function cylinderPositions(n) {
	let positions = [];
	const random = randomPos();
	for (var i = 0.0; i <= n; i++) {
		var j = i * Math.PI / 180;
		var vert1 = [Math.sin(j) + random, Math.cos(j) + random, random];
		var vert2 = [Math.sin(j) + random, Math.cos(j) + random, -8];
		positions = positions.concat(vert1);
		positions = positions.concat(vert2);
		  }
		  return positions;
}

function colorPicker(n) {
	let colors = [];
	let faceColor = randomColor();
	for (let i = 0; i < n; i++) {
		
		colors.push(...faceColor);
	}
	return colors;
}

function randomPos() {
	return Math.random() * 10;
}

function initCylinderBuffers(gl) {
	let positions = cylinderPositions(360);
	let colors = colorPicker(1080)

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		vertexCount: positions.length/3
	};
}
function pointCloud(pointCount) {
	let points = [];
    for (let i = 0; i < pointCount; i++) {
        const r = () => Math.random() * 200; // -.5 x < < .5
        const inputPoint = [r(), r()*2, r()];
        points = points.concat(inputPoint);
    }
    return points;
}
function initPointBuffers(gl) {
	let positions = pointCloud(10000);
	let colors = colorPicker(10e5);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		vertexCount: positions.length
	};
	
}






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


function clearCanvas(gl) {
	gl.clearColor(0.9, 0.9, 0.9, 1);  // Clear screen farge.
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);           // Enable "depth testing".
	gl.depthFunc(gl.LEQUAL);            // Nære objekter dekker fjerne objekter.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

//SNAKK 3
function animate(currentTime, renderInfo, camera) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime, renderInfo, camera);
	});
	

	let elapsed = getElapsed(currentTime, renderInfo);

	renderInfo.cylinderAnimation.earthRotationAngle += (renderInfo.cylinderAnimation.earthRotationsSpeed * elapsed);
	renderInfo.cylinderAnimation.earthRotationAngle %= 360;

	renderInfo.cylinderAnimation.moonRotationAngle += (renderInfo.cylinderAnimation.moonRotationsSpeed * elapsed);
	renderInfo.cylinderAnimation.moonRotationAngle %= 360;

	renderInfo.cylinderAnimation.moonOrbitAngle += (renderInfo.cylinderAnimation.moonOrbitSpeed * elapsed);
	renderInfo.cylinderAnimation.moonOrbitAngle %= 360;

	renderInfo.triangleAnimation.angle = renderInfo.triangleAnimation.angle + (renderInfo.triangleAnimation.rotationsSpeed * elapsed);
	renderInfo.triangleAnimation.angle %= 360;
	renderInfo.triangleAnimation.lastTime = currentTime;

	renderInfo.pointAnimation.translation = renderInfo.pointAnimation.translation + (renderInfo.pointAnimation.speed * elapsed);
	renderInfo.pointAnimation.lastTime = currentTime;
	console.log(renderInfo.pointAnimation.translation)

	camera.handleKeys(renderInfo.currentlyPressedKeys);
	calculateFps(currentTime, renderInfo.fpsInfo);

	draw(currentTime, renderInfo, camera);
	
}


function getElapsed(currentTime, renderInfo) {
	let elapsed = 0.0;
	if (renderInfo.lastTime !== 0.0)
		elapsed = (currentTime - renderInfo.lastTime)/1000;
	renderInfo.lastTime = currentTime;						
	return elapsed;
}


function calculateFps(currentTime, fpsInfo) {
	if (!currentTime) currentTime = 0;
	// Sjekker om  ET sekund har forløpt...
	if (currentTime - fpsInfo.lastTimeStamp >= 1000) {
		// Viser FPS i .html ("fps" er definert i .html fila):
		document.getElementById('fps').innerHTML = fpsInfo.frameCount;
		// Nullstiller fps-teller:
		fpsInfo.frameCount = 0;
		//Brukes for å finne ut om det har gått 1 sekund - i så fall beregnes FPS på nytt.
		fpsInfo.lastTimeStamp = currentTime;
	}
	// Øker antall frames per sekund:
	fpsInfo.frameCount++;
}



//SNAKK 4
function draw(currentTime, renderInfo, camera) {
	clearCanvas(renderInfo.gl);

	renderInfo.gl.useProgram(renderInfo.baseShaderInfo.program);
	
	connectPositionAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.coordBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.coordBuffers.color);
	drawCoord(renderInfo, camera);

	connectPositionAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.triangleBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.triangleBuffers.color);
	drawTriangle(renderInfo, camera);

	connectPositionAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.cubeBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.cubeBuffers.color);
	drawCube(renderInfo, camera);

	connectPositionAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.circleBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.circleBuffers.color);
	drawCircle(renderInfo, camera);
	drawMeshCircle(renderInfo, camera);

	connectPositionAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.cylinderBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.cylinderBuffers.color);
	drawCylinder(renderInfo, camera);
	drawCylinder2(renderInfo, camera);
	drawMeshCylinder(renderInfo, camera);
	connectPositionAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.pointBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.baseShaderInfo, renderInfo.pointBuffers.color);
	drawPoints(renderInfo, camera);
}


//SNAKK 5
function drawCoord(renderInfo, camera) {
	let modelMatrix = new Matrix4();
	modelMatrix.setIdentity();
	camera.set();
	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix)); 
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);

	renderInfo.gl.drawArrays(renderInfo.gl.LINES, 0, renderInfo.coordBuffers.vertexCount);
}

function drawTriangle(renderInfo, camera) {
	let modelMatrix = new Matrix4();
	camera.set();
	modelMatrix.setIdentity();
	modelMatrix.rotate(renderInfo.triangleAnimation.angle, 0, 1, 0);

	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix)); 


	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);


	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLES, 0, renderInfo.triangleBuffers.vertexCount);
}

function drawCube(renderInfo, camera) {
	let modelMatrix = new Matrix4();
	camera.set();
	modelMatrix.setIdentity();
	modelMatrix.scale(100, 100, 100)

	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix));


	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);


	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLES, 0, renderInfo.cubeBuffers.vertexCount);
}

function drawCircle(renderInfo, camera) {
	let modelMatrix = new Matrix4();
	camera.set();
	modelMatrix.setIdentity();
	modelMatrix.translate(3, 0, 5);
	modelMatrix.rotate(45, 0, 1, 0);
	modelMatrix.rotate(90, 1, 0, 0);
	modelMatrix.scale(1, 1, 1);

	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix)); // NB! rekkefølge!


	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);


	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLE_STRIP, 0, renderInfo.circleBuffers.vertexCount);
}

function drawMeshCircle(renderInfo, camera) {
	let modelMatrix = new Matrix4();
	camera.set();
	modelMatrix.setIdentity();
	modelMatrix.rotate(45, 0, 1, 0);
	modelMatrix.rotate(90, 1, 0, 0);
	modelMatrix.scale(2, 2, 2);

	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix)); // NB! rekkefølge!

	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);

	renderInfo.gl.drawArrays(renderInfo.gl.LINES, 0, renderInfo.circleBuffers.vertexCount);
}

function drawCylinder(renderInfo, camera) {
	let modelMatrix = new Matrix4();
	camera.set();
	modelMatrix.translate(-10, 20, 10);
	modelMatrix.setIdentity();
	modelMatrix.scale(4, 4, 4);
	modelMatrix.rotate(renderInfo.cylinderAnimation.moonOrbitAngle, 1, 0, 0);
	modelMatrix.translate(0, 0, renderInfo.cylinderAnimation.moonTranslation);

	modelMatrix.rotate(renderInfo.cylinderAnimation.moonRotationAngle, 1, 0, 0);

	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix));

	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);


	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLE_STRIP, 0, renderInfo.cylinderBuffers.vertexCount);
}

function drawCylinder2(renderInfo, camera) {
	let modelMatrix = new Matrix4();
	camera.set();
	modelMatrix.setIdentity();
	modelMatrix.scale(2, 2, 2);
	modelMatrix.rotate(renderInfo.cylinderAnimation.moonOrbitAngle, 1, 0, 0); 
	modelMatrix.translate(0, 0, renderInfo.cylinderAnimation.moonTranslation);

	modelMatrix.rotate(renderInfo.cylinderAnimation.moonRotationAngle, 1, 0, 0);

	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix));

	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);

	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLE_STRIP, 0, renderInfo.cylinderBuffers.vertexCount);
}




function drawMeshCylinder(renderInfo, camera) {
	let modelMatrix = new Matrix4();
	camera.set();
	
	modelMatrix.setIdentity();
	modelMatrix.rotate(renderInfo.cylinderAnimation.moonOrbitAngle, 1, 0, 0);      //Går i "bane" om y-aksen.

	modelMatrix.rotate(renderInfo.cylinderAnimation.moonRotationAngle, 1, 0, 0); 	//Roterer om origo. Y-aksen.
	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix)); // NB! rekkefølge!

	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);
	
	renderInfo.gl.drawArrays(renderInfo.gl.LINES, 0, renderInfo.cylinderBuffers.vertexCount);
}

function drawPoints(renderInfo, camera) {
	let modelMatrix = new Matrix4();
	camera.set();
	
	modelMatrix.setIdentity();
	modelMatrix.translate(-100, 100, -100);
	
	console.log(2);
	modelMatrix.translate(0, -renderInfo.pointAnimation.translation, 0);


	if(renderInfo.pointAnimation.translation > 401) {
		renderInfo.pointAnimation.translation = 200;
	}
	let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix)); // NB! rekkefølge!

	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShaderInfo.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);
	
	renderInfo.gl.drawArrays(renderInfo.gl.POINTS, 0, renderInfo.pointBuffers.vertexCount);
	
}
