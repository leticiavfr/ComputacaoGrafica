// Vertex shader source code
const vertexShaderSource2 = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main() {
        gl_Position = a_position;
        v_color = a_color;
    }
`;

// Fragment shader source code
const fragmentShaderSource2 = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`;

function createShader2(gl, type, source) {
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

function createProgram2(gl, vertexShader, fragmentShader) {
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

function rectangleVertices1(){
    return new Float32Array([
        -0.8,  0.4, // Ponto superior esquerdo
         0.8,  0.4, // Ponto superior direito
         0.8, -0.4, // Ponto inferior direito
        -0.8, -0.4, // Ponto inferior esquerdo
         0.8, -0.4, // Ponto inferior direito
        -0.8,  0.4  // Ponto superior esquerdo
    ]);
}

function rectangleColors1(){
    let color = [0.0, 0.0, 1.0];
    let colorValues = [];
    for(let i=0;i<6;i++){
        colorValues.push(color[0], color[1], color[2]);
    }
    return new Float32Array(colorValues);
}

function squareVertices(x,y,weight,height){
    return new Float32Array([
        x,y+height,
        x+weight,y+height,
        x+weight,y,
        x,y,
        x+weight,y,
        x,y+height
    ]);
}

function circleVertices4(numSegments = 50, radius = 0.25, cx = 0.0, cy = 0.0) {
    let vertices = [cx, cy];
    for (let i = 0; i <= numSegments; i++) {
        let angle = (i * 2 * Math.PI) / numSegments;
        let x = cx + Math.cos(angle) * radius;
        let y = cy + Math.sin(angle) * radius;
        vertices.push(x, y);
    }
    return new Float32Array(vertices);
}


function main2() {
    const canvas = document.getElementById('glCanvas3');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const vertexShader = createShader2(gl, gl.VERTEX_SHADER, vertexShaderSource2);
    const fragmentShader = createShader2(gl, gl.FRAGMENT_SHADER, fragmentShaderSource2);
    
    const program = createProgram2(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');

    const VertexBuffer = gl.createBuffer();
    const ColorBuffer = gl.createBuffer();
    
    let vertices = [];
    let colors = [];

    gl.clearColor(0.0, 0.0, 0.0, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enableVertexAttribArray(positionLocation);
    vertices = rectangleVertices1();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    colors = rectangleColors1();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    let vertices2 = [];

    vertices2 = squareVertices(-0.4,0.4,0.8,0.4);
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const circleVerts3 = circleVertices4(60, 0.2, -0.35, -0.30); 
    const circleColors = [];
    for (let i = 0; i < circleVerts3.length/2; i++) {
        circleColors.push(1.0, 1.0, 1.0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleVerts3, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleColors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVerts3.length / 2);

    const circleVerts4 = circleVertices4(60, 0.2, 0.35, -0.30); 

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, circleVerts4, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleColors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVerts4.length / 2);

    vertices2 = squareVertices(-0.1,0.4,0.5,0.3);
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleColors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

window.addEventListener('load', main2);