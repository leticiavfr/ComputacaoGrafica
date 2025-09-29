// Vertex shader source code 
const robotVertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    uniform mat3 u_matrix;

    void main() {
        gl_Position = vec4((u_matrix * vec3(a_position.xy, 1.0)).xy, 0.0, 1.0);
        v_color = a_color;
    }
`;

// Fragment shader source code
const robotFragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`;

function createRobotShader(robotGl, type, source) {
    const robotShader = robotGl.createShader(type);
    robotGl.shaderSource(robotShader, source);
    robotGl.compileShader(robotShader);

    if (!robotGl.getShaderParameter(robotShader, robotGl.COMPILE_STATUS)) {
        console.error('Error compiling robot shader:', robotGl.getShaderInfoLog(robotShader));
        robotGl.deleteShader(robotShader);
        return null;
    }

    return robotShader;
}

function createRobotProgram(robotGl, robotVertexShader, robotFragmentShader) {
    const robotProgram = robotGl.createProgram();
    robotGl.attachShader(robotProgram, robotVertexShader);
    robotGl.attachShader(robotProgram, robotFragmentShader);
    robotGl.linkProgram(robotProgram);

    if (!robotGl.getProgramParameter(robotProgram, robotGl.LINK_STATUS)) {
        console.error('Error linking robot program:', robotGl.getProgramInfoLog(robotProgram));
        robotGl.deleteProgram(robotProgram);
        return null;
    }

    return robotProgram;
}

function rectangleVertices() {
    return new Float32Array([
        -0.65,  0.35,
         0.65,  0.35,
         0.65, -0.35,
        -0.65, -0.35,
         0.65, -0.35,
        -0.65,  0.35
    ]);
}

function rectangleColors(){
    let color = [1.0, 0.0, 0.0]; 
    let colorValues = [];
    for(let i=0;i<6;i++){
        colorValues.push(color[0], color[1], color[2]); 
    }
    return new Float32Array(colorValues);
}

function squareVertices1(){
    return new Float32Array([
        -0.5,  0.5,
         0.5,  0.5,
         0.5, -0.5,
        -0.5, -0.5,
         0.5, -0.5,
        -0.5,  0.5
    ]);
}

function squareColors1(){
    let color = [0.5, 0.5, 0.5]; 
    let colorValues = [];
    for(let i=0;i<6;i++){
        colorValues.push(color[0], color[1], color[2]); 
    }
    return new Float32Array(colorValues);
}

function circleVertices3(numSegments = 50, radius = 0.25, cx = 0.0, cy = 0.0) {
    let vertices = [cx, cy]; 
    for (let i = 0; i <= numSegments; i++) {
        let angle = (i * 2 * Math.PI) / numSegments;
        let x = cx + Math.cos(angle) * radius;
        let y = cy + Math.sin(angle) * radius;
        vertices.push(x, y);
    }
    return new Float32Array(vertices);
}

function squareVertices2(){
    return new Float32Array([
        -0.15, -0.2,  
         0.15, -0.2,  
         0.15, -0.4,   
        -0.15, -0.4,   
         0.15, -0.4,  
        -0.15, -0.2   
    ]);
}

function squareColors2(){
    let color = [1.0, 1.0, 1.0]; 
    let colorValues = [];
    for(let i=0;i<6;i++){
        colorValues.push(color[0], color[1], color[2]); 
    }
    return new Float32Array(colorValues);
}

function drawRobot(robotGl, robotProgram, robotPositionLocation, robotColorLocation, robotMatrixLocation, robotTime) {
    const robotVertexBuffer = robotGl.createBuffer();
    const robotColorBuffer = robotGl.createBuffer();

    robotGl.clearColor(0.0, 0.0, 0.0, 1.0); 
    robotGl.clear(robotGl.COLOR_BUFFER_BIT);

    robotGl.enableVertexAttribArray(robotPositionLocation);
    robotGl.enableVertexAttribArray(robotColorLocation);

    let robotStaticMatrix = m3.identity();

    let vertices0 = rectangleVertices();
    let colors0 = rectangleColors();

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotVertexBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, vertices0, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotPositionLocation, 2, robotGl.FLOAT, false, 0, 0);

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotColorBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, colors0, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotColorLocation, 3, robotGl.FLOAT, false, 0, 0);

    robotGl.uniformMatrix3fv(robotMatrixLocation, false, robotStaticMatrix);
    robotGl.drawArrays(robotGl.TRIANGLES, 0, 6);

    let vertices = squareVertices1();
    let colors = squareColors1();

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotVertexBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, vertices, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotPositionLocation, 2, robotGl.FLOAT, false, 0, 0);

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotColorBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, colors, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotColorLocation, 3, robotGl.FLOAT, false, 0, 0);

    robotGl.uniformMatrix3fv(robotMatrixLocation, false, robotStaticMatrix);
    robotGl.drawArrays(robotGl.TRIANGLES, 0, 6);

    let noseRotation = robotTime * 2.0;
    let noseMatrix = m3.identity();
    noseMatrix = m3.rotate(noseMatrix, noseRotation);

    const triangleVertices = new Float32Array([
         0.0,  0.1, 
        -0.1, -0.1, 
         0.1, -0.1  
    ]);

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotVertexBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, triangleVertices, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotPositionLocation, 2, robotGl.FLOAT, false, 0, 0);

    const triangleColors = new Float32Array([
        1.0, 0.0, 0.0, 
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0
    ]);

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotColorBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, triangleColors, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotColorLocation, 3, robotGl.FLOAT, false, 0, 0);

    robotGl.uniformMatrix3fv(robotMatrixLocation, false, noseMatrix);
    robotGl.drawArrays(robotGl.TRIANGLES, 0, 3);

    const circleVerts = circleVertices3(60, 0.1, 0.25, 0.15); 
    const circleColors = [];
    for (let i = 0; i < circleVerts.length/2; i++) {
        circleColors.push(0.0, 0.0, 0.0);
    }

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotVertexBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, circleVerts, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotPositionLocation, 2, robotGl.FLOAT, false, 0, 0);

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotColorBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, new Float32Array(circleColors), robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotColorLocation, 3, robotGl.FLOAT, false, 0, 0);

    robotGl.uniformMatrix3fv(robotMatrixLocation, false, robotStaticMatrix);
    robotGl.drawArrays(robotGl.TRIANGLE_FAN, 0, circleVerts.length / 2);

    const circleVerts2 = circleVertices3(60, 0.1, -0.25, 0.15); 

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotVertexBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, circleVerts2, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotPositionLocation, 2, robotGl.FLOAT, false, 0, 0);

    robotGl.uniformMatrix3fv(robotMatrixLocation, false, robotStaticMatrix);
    robotGl.drawArrays(robotGl.TRIANGLE_FAN, 0, circleVerts2.length / 2);

    let vertices2 = squareVertices2();
    let colors2 = squareColors2();

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotVertexBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, vertices2, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotPositionLocation, 2, robotGl.FLOAT, false, 0, 0);

    robotGl.bindBuffer(robotGl.ARRAY_BUFFER, robotColorBuffer);
    robotGl.bufferData(robotGl.ARRAY_BUFFER, colors2, robotGl.STATIC_DRAW);
    robotGl.vertexAttribPointer(robotColorLocation, 3, robotGl.FLOAT, false, 0, 0);

    robotGl.uniformMatrix3fv(robotMatrixLocation, false, robotStaticMatrix);
    robotGl.drawArrays(robotGl.TRIANGLES, 0, 6);
}

let robotAnimationRunning = true;
let robotAnimationDirection = 1;
let robotAnimationId;

function animateRobotScene(robotGl, robotProgram, robotPositionLocation, robotColorLocation, robotMatrixLocation) {
    function renderRobotFrame(currentTime) {
        if (!robotAnimationRunning) return;
        
        const time = currentTime * 0.001 * robotAnimationDirection; 

        drawRobot(robotGl, robotProgram, robotPositionLocation, robotColorLocation, robotMatrixLocation, time);

        robotAnimationId = requestAnimationFrame(renderRobotFrame);
    }
    robotAnimationId = requestAnimationFrame(renderRobotFrame);
}

function toggleRobotAnimation() {
    robotAnimationRunning = !robotAnimationRunning;
    if (robotAnimationRunning) {
        animateRobotScene(robotGl, robotProgram, robotPositionLocation, robotColorLocation, robotMatrixLocation);
    } else {
        cancelAnimationFrame(robotAnimationId);
    }
}

function reverseRobotDirection() {
    robotAnimationDirection *= -1;
}

let robotGl, robotProgram, robotPositionLocation, robotColorLocation, robotMatrixLocation;

function initializeRobot() {
    const canvas = document.getElementById('glCanvas1');
    robotGl = canvas.getContext('webgl');

    if (!robotGl) {
        console.error('WebGL not supported for robot');
        return;
    }

    const robotVertexShader = createRobotShader(robotGl, robotGl.VERTEX_SHADER, robotVertexShaderSource);
    const robotFragmentShader = createRobotShader(robotGl, robotGl.FRAGMENT_SHADER, robotFragmentShaderSource);
    
    robotProgram = createRobotProgram(robotGl, robotVertexShader, robotFragmentShader);
    robotGl.useProgram(robotProgram);

    robotPositionLocation = robotGl.getAttribLocation(robotProgram, 'a_position');
    robotColorLocation = robotGl.getAttribLocation(robotProgram, 'a_color');
    robotMatrixLocation = robotGl.getUniformLocation(robotProgram, 'u_matrix');

    robotGl.viewport(0, 0, canvas.width, canvas.height);

    animateRobotScene(robotGl, robotProgram, robotPositionLocation, robotColorLocation, robotMatrixLocation);
}

window.addEventListener('load', initializeRobot);