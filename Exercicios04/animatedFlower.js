// Vertex shader source code
const vertexShaderSource3 = `
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
const fragmentShaderSource3 = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`;

function createShader3(gl, type, source) {
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

function createProgram3(gl, vertexShader, fragmentShader) {
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

function circleVertices3(numSegments = 50, radius = 0.2, cx = 0.0, cy = 0.0){
    let vertices = [cx, cy];

    for (let i = 0; i <= numSegments; i++){
        let angle = (i * 2 * Math.PI) / numSegments;
        let x = cx + Math.cos(angle) * radius;
        let y = cy + Math.sin(angle) * radius;
        vertices.push(x, y); 
    }

    return new Float32Array(vertices);
}

function drawFlower(gl, program, positionLocation, colorLocation, matrixLocation, time){
    const VertexBuffer = gl.createBuffer();
    const ColorBuffer = gl.createBuffer();
    let numSegments = 60;

    let petalas = 6;

    let rotacaoPetalas = time * 0.8;

    for(let i=0; i<petalas; i++){
        let angle = (i * 2 * Math.PI) / petalas + rotacaoPetalas;
        let cx = Math.cos(angle) * 0.5;
        let cy = Math.sin(angle) * 0.5;

        let vertices = circleVertices3(numSegments, 0.3, cx, cy);

        let colors = [];
        for(let j=0;j<vertices.length/2;j++){
            colors.push(1.0, 0.0, 1.0);
        }

        let matrix = m3.identity();

        gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorLocation);

        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
    }

    let miolo = circleVertices3(numSegments, 0.3, 0.0, 0.0);
    let colorsMiolo = [];
    for(let j=0;j<miolo.length/2;j++){
        colorsMiolo.push(1.0, 1.0, 0.0);
    }

    let mioloMatrix = m3.identity();

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, miolo, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsMiolo), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(matrixLocation, false, mioloMatrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
}

let animationRunning = true;
let animationDirection = 1;
let animationId;

function animate(gl, program, positionLocation, colorLocation, matrixLocation) {
    function render(currentTime) {
        if (!animationRunning) return;
        
        const time = currentTime * 0.001 * animationDirection; // Converter para segundos

        gl.clearColor(0.0, 0.0, 0.0, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT);

        drawFlower(gl, program, positionLocation, colorLocation, matrixLocation, time);

        animationId = requestAnimationFrame(render);
    }
    animationId = requestAnimationFrame(render);
}

function toggleAnimation() {
    animationRunning = !animationRunning;
    if (animationRunning) {
        animate(gl, program, positionLocation, colorLocation, matrixLocation);
    } else {
        cancelAnimationFrame(animationId);
    }
}

function reverseDirection() {
    animationDirection *= -1;
}

let gl, program, positionLocation, colorLocation, matrixLocation;

function main3() {
    const canvas = document.getElementById('glCanvas4');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const vertexShader = createShader3(gl, gl.VERTEX_SHADER, vertexShaderSource3);
    const fragmentShader = createShader3(gl, gl.FRAGMENT_SHADER, fragmentShaderSource3);
    
    const program = createProgram3(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    positionLocation = gl.getAttribLocation(program, 'a_position');
    colorLocation = gl.getAttribLocation(program, 'a_color');
    matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    gl.viewport(0, 0, canvas.width, canvas.height);

    animate(gl, program, positionLocation, colorLocation, matrixLocation);
}

window.addEventListener('load', main3);
