// Vertex shader source code
const vertexShaderSource1 = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main() {
        gl_Position = a_position;
        v_color = a_color;
    }
`;

// Fragment shader source code
const fragmentShaderSource1 = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`;

function createShader1(gl, type, source) {
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

function createProgram1(gl, vertexShader, fragmentShader) {
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

function rectangleVertices() {
    return new Float32Array([
        -0.65,  0.35, // Ponto superior esquerdo
         0.65,  0.35, // Ponto superior direito
         0.65, -0.35, // Ponto inferior direito
        -0.65, -0.35, // Ponto inferior esquerdo
         0.65, -0.35, // Ponto inferior direito
        -0.65,  0.35  // Ponto superior esquerdo
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

function main1() {
    const canvas = document.getElementById('glCanvas1');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const vertexShader = createShader1(gl, gl.VERTEX_SHADER, vertexShaderSource1);
    const fragmentShader = createShader1(gl, gl.FRAGMENT_SHADER, fragmentShaderSource1);
    
    const program = createProgram1(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');

    const VertexBuffer = gl.createBuffer();
    const ColorBuffer = gl.createBuffer();
    
    let vertices = [];
    let colors = [];

    let vertices0 = [];
    let colors0 = [];
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enableVertexAttribArray(positionLocation);
    vertices0 = rectangleVertices();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices0, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    colors0 = rectangleColors();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors0, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.enableVertexAttribArray(positionLocation);
    vertices = squareVertices1();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    colors = squareColors1();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const triangleVertices = new Float32Array([
         0.0,  0.1,
        -0.1, -0.1,
         0.1, -0.1
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const triangleColors = new Float32Array([
        1.0, 0.0, 0.0, 
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleColors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const circleVerts = circleVertices3(60, 0.1, 0.25, 0.15); 
    const circleColors = [];
    for (let i = 0; i < circleVerts.length/2; i++) {
        circleColors.push(0.0, 0.0, 0.0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleVerts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleColors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVerts.length / 2);

    const circleVerts2 = circleVertices3(60, 0.1, -0.25, 0.15); 

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleVerts2, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleColors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVerts2.length / 2);

    let vertices2 = [];
    let colors2 = [];

    vertices2 = squareVertices2();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    colors2 = squareColors2();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors2, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

}

window.addEventListener('load', main1);