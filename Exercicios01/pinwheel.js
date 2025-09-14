// Vertex shader source code
const vertexShaderSource4 = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    uniform mat4 u_matrix;
    void main() {
        gl_Position = u_matrix * a_position;
        v_color = a_color;
    }
`;

// Fragment shader source code
const fragmentShaderSource4 = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`;

function createShader4(gl, type, source) {
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

function createProgram4(gl, vertexShader, fragmentShader) {
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

function squareVertices4(){
    return new Float32Array([
        -0.5,  0.5,
         0.5,  0.5,
         0.5, -0.5,
        -0.5, -0.5,
         0.5, -0.5,
        -0.5,  0.5
    ]);
}

function squareColors4(){
    let color = [0.0, 1.0, 0.0];
    let colorValues = [];
    for(let i=0;i<6;i++){
        colorValues.push(color[0], color[1], color[2]);
    }
    return new Float32Array(colorValues);
}

function triangleVertices4(){
    return new Float32Array([
        -0.3, -0.3,   // vértice inferior esquerdo
         0.3, -0.3,   // vértice inferior direito
        -0.3,  0.3    // vértice superior esquerdo
    ]);
}

function triangleColors4(){
    let color = [0.8, 1.0, 0.0]; 
    let colorValues = [];
    for(let i=0;i<3;i++){
        colorValues.push(color[0], color[1], color[2]); 
    }
    return new Float32Array(colorValues);
}

function getRotationMatrix(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return new Float32Array([
        c,  s, 0, 0,
       -s,  c, 0, 0,
        0,  0, 1, 0,
        0,  0, 0, 1,
    ]);
}

function getTranslationMatrix(tx, ty) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, 0, 1,
    ]);
}

function multiplyMatrices(a, b) {
    let result = new Float32Array(16);
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let sum = 0;
            for (let i = 0; i < 4; i++) {
                sum += a[i * 4 + col] * b[row * 4 + i];
            }
            result[row * 4 + col] = sum;
        }
    }
    return result;
}

function main4() {
    const canvas = document.getElementById('glCanvas2');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const vertexShader = createShader4(gl, gl.VERTEX_SHADER, vertexShaderSource4);
    const fragmentShader = createShader4(gl, gl.FRAGMENT_SHADER, fragmentShaderSource4);
    
    const program = createProgram4(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    const VertexBuffer = gl.createBuffer();
    const ColorBuffer = gl.createBuffer();
    
    let vertices = [];
    let colors = [];

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enableVertexAttribArray(positionLocation);
    vertices = squareVertices4();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    colors = squareColors4();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    let angle = Math.PI / 4;
    let rotationMatrix = getRotationMatrix(angle);
    gl.uniformMatrix4fv(matrixLocation, false, rotationMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    let triangleVertice = [];
    let triangleColor = [];

    gl.enableVertexAttribArray(positionLocation);
    triangleVertice = triangleVertices4();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertice, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    triangleColor = triangleColors4();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleColor, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    for (let i = 0; i < 4; i++) {
        let angle = i * Math.PI / 2; 
        let translation = getTranslationMatrix(0.0, 0.7); 
        let rotation = getRotationMatrix(angle);

        let finalMatrix = multiplyMatrices(rotation, translation);
        gl.uniformMatrix4fv(matrixLocation, false, finalMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

window.addEventListener('load', main4);