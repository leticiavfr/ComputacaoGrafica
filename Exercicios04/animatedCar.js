// Vertex shader source code
const carVertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    uniform mat3 u_matrix;

    void main() {
        gl_Position = vec4((u_matrix * vec3(a_position.xy,1.0)).xy, 0.0, 1.0);
        v_color = a_color;
    }
`;

// Fragment shader source code
const carFragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`;

function createCarShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createCarProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

function carBodyVertices(){
    return new Float32Array([
        -0.8,  0.4, // Ponto superior esquerdo
         0.8,  0.4, // Ponto superior direito
         0.8, -0.4, // Ponto inferior direito
        -0.8, -0.4, // Ponto inferior esquerdo
         0.8, -0.4, // Ponto inferior direito
        -0.8,  0.4  // Ponto superior esquerdo
    ]);
}

function carBodyColors(){
    let color = [0.0, 0.0, 1.0];
    let colorValues = [];
    for(let i=0;i<6;i++){
        colorValues.push(color[0], color[1], color[2]);
    }
    return new Float32Array(colorValues);
}

function carSquareVertices(x,y,weight,height){
    return new Float32Array([
        x,y+height,
        x+weight,y+height,
        x+weight,y,
        x,y,
        x+weight,y,
        x,y+height
    ]);
}

function carCircleVertices(numSegments = 50, radius = 0.25, cx = 0.0, cy = 0.0) {
    let vertices = [cx, cy];
    for (let i = 0; i <= numSegments; i++) {
        let angle = (i * 2 * Math.PI) / numSegments;
        let x = cx + Math.cos(angle) * radius;
        let y = cy + Math.sin(angle) * radius;
        vertices.push(x, y);
    }
    return new Float32Array(vertices);
}

function drawCarScene(gl, program, positionLocation, colorLocation, matrixLocation, time) {
    const carVertexBuffer = gl.createBuffer();
    const carColorBuffer = gl.createBuffer();
    
    let carPositionX = Math.sin(time * 0.5) * 0.6;
    
    let carTransformMatrix = m3.identity();
    carTransformMatrix = m3.translate(carTransformMatrix, carPositionX, 0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(colorLocation);

    let carVertices = carBodyVertices();
    let carColors = carBodyColors();

    gl.bindBuffer(gl.ARRAY_BUFFER, carVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, carVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, carColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, carColors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(matrixLocation, false, carTransformMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    let vertices2 = carSquareVertices(-0.4, 0.4, 0.8, 0.4);

    gl.bindBuffer(gl.ARRAY_BUFFER, carVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(matrixLocation, false, carTransformMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const circleVerts3 = carCircleVertices(60, 0.2, -0.35, -0.30); 
    const circleColors = [];
    for (let i = 0; i < circleVerts3.length/2; i++) {
        circleColors.push(1.0, 1.0, 1.0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, carVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleVerts3, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, carColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleColors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(matrixLocation, false, carTransformMatrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVerts3.length / 2);

    const circleVerts4 = carCircleVertices(60, 0.2, 0.35, -0.30); 

    gl.bindBuffer(gl.ARRAY_BUFFER, carVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleVerts4, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(matrixLocation, false, carTransformMatrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVerts4.length / 2);

    vertices2 = carSquareVertices(-0.1, 0.4, 0.5, 0.3);
    const vertices2Colors = [];
    for (let i = 0; i < 6; i++) {
        vertices2Colors.push(1.0, 1.0, 1.0); 
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, carVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, carColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2Colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(matrixLocation, false, carTransformMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

let carAnimationRunning = true;
let carAnimationDirection = 1;
let carAnimationId;

function animateCarScene(carGl, carProgram, carPositionLocation, carColorLocation, carMatrixLocation) {
    function renderCarFrame(currentTime) {
        if (!carAnimationRunning) return;
        
        const time = currentTime * 0.001 * carAnimationDirection; 

        drawCarScene(carGl, carProgram, carPositionLocation, carColorLocation, carMatrixLocation, time);

        carAnimationId = requestAnimationFrame(renderCarFrame);
    }
    carAnimationId = requestAnimationFrame(renderCarFrame);
}

function toggleCarAnimation() {
    carAnimationRunning = !carAnimationRunning;
    if (carAnimationRunning) {
        animateCarScene(carGl, carProgram, carPositionLocation, carColorLocation, carMatrixLocation);
    } else {
        cancelAnimationFrame(carAnimationId);
    }
}

function reverseCarDirection() {
    carAnimationDirection *= -1;
}

let carGl, carProgram, carPositionLocation, carColorLocation, carMatrixLocation;

function initializeCar() {
    const canvas = document.getElementById('glCanvas3');
    carGl = canvas.getContext('webgl');

    if (!carGl) {
        console.error('WebGL not supported');
        return;
    }

    const carVertexShader = createCarShader(carGl, carGl.VERTEX_SHADER, carVertexShaderSource);
    const carFragmentShader = createCarShader(carGl, carGl.FRAGMENT_SHADER, carFragmentShaderSource);
    
    carProgram = createCarProgram(carGl, carVertexShader, carFragmentShader);
    carGl.useProgram(carProgram);

    carPositionLocation = carGl.getAttribLocation(carProgram, 'a_position');
    carColorLocation = carGl.getAttribLocation(carProgram, 'a_color');
    carMatrixLocation = carGl.getUniformLocation(carProgram, 'u_matrix');

    carGl.viewport(0, 0, canvas.width, canvas.height);

    animateCarScene(carGl, carProgram, carPositionLocation, carColorLocation, carMatrixLocation);
}

window.addEventListener('load', initializeCar);