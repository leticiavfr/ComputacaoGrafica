// Vertex shader source code
const vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_viewingMatrix;
    uniform mat4 u_projectionMatrix;

    void main() {
        gl_Position = u_projectionMatrix * u_viewingMatrix * u_modelViewMatrix * vec4(a_position,1.0);
        v_color = a_color;
    }
`;

// Fragment shader source code
const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;
    void main() {
        gl_FragColor = vec4(v_color,1.0);
    }
`;

function createShader(gl, type, source) {
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

function createProgram(gl, vertexShader, fragmentShader) {
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

function setCubeVertices(side){
  let v = side/2;
  return new Float32Array([
      // Front
      v, v, v,   v, -v, v,   -v, v, v,
      -v, v, v,  v, -v, v,   -v, -v, v,
      // Left
      -v, v, v,  -v, -v, v,  -v, v, -v,
      -v, v, -v, -v, -v, v,  -v, -v, -v,
      // Back
      -v, v, -v, -v, -v, -v, v, v, -v,
      v, v, -v,  -v, -v, -v, v, -v, -v,
      // Right
      v, v, -v,  v, -v, -v,  v, v, v,
      v, v, v,   v, -v, v,   v, -v, -v,
      // Top
      v, v, v,   v, v, -v,   -v, v, v,
      -v, v, v,  v, v, -v,   -v, v, -v,
      // Bottom
      v, -v, v,  v, -v, -v,  -v, -v, v,
      -v, -v, v, v, -v, -v,  -v, -v, -v,
  ]);
}

function setCubeColors(){
  let colors = [];
  for(let i=0;i<6;i++){
    let color = [Math.random(),Math.random(),Math.random()];
    for(let j=0;j<6;j++)
      colors.push(...color);
  }
  return new Float32Array(colors);
}

function definePlane(size){
    let s = size/2;
    return new Float32Array([
        -s,0,-s,  s,0,-s,  s,0,s,
        -s,0,-s,  s,0,s,  -s,0,s
    ]);
}

function definePlaneColors(){
    return new Float32Array([
        0.8,0.8,0.8, 0.8,0.8,0.8, 0.8,0.8,0.8,
        0.8,0.8,0.8, 0.8,0.8,0.8, 0.8,0.8,0.8
    ]);
}

function main() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');

    const VertexBuffer = gl.createBuffer();
    const ColorBuffer = gl.createBuffer();
    
    const modelViewMatrixUniformLocation = gl.getUniformLocation(program,'u_modelViewMatrix');
    const viewingMatrixUniformLocation = gl.getUniformLocation(program,'u_viewingMatrix');
    const projectionMatrixUniformLocation = gl.getUniformLocation(program,'u_projectionMatrix');

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    let cubeVertices = setCubeVertices(0.5);
    let cubeColors = setCubeColors();

    let cameraPos = [3.0, 2.0, 3.0];
    let cameraTarget = [0.0, 0.0, 0.0];
    let upVector = [0.0, 1.0, 0.0];
    let cameraAngleY = Math.atan2(cameraPos[0] - cameraTarget[0], cameraPos[2] - cameraTarget[2]);

    const fov = degToRad(60);
    const aspect = canvas.width / canvas.height;
    const zNear = 0.1;
    const zFar = 50.0;
    const projectionMatrix = m4.setPerspectiveMatrix(fov, aspect, zNear, zFar);

    const moveSpeed = 0.2;
    const rotSpeed = degToRad(5); 

    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        const forward = [Math.sin(cameraAngleY), 0, Math.cos(cameraAngleY)];
        const right = [Math.cos(cameraAngleY), 0, -Math.sin(cameraAngleY)];

        switch(key){
            case 'w': 
                cameraPos[0] += forward[0] * moveSpeed;
                cameraPos[2] += forward[2] * moveSpeed;
                cameraTarget[0] += forward[0] * moveSpeed;
                cameraTarget[2] += forward[2] * moveSpeed;
                break;
            case 's': 
                cameraPos[0] -= forward[0] * moveSpeed;
                cameraPos[2] -= forward[2] * moveSpeed;
                cameraTarget[0] -= forward[0] * moveSpeed;
                cameraTarget[2] -= forward[2] * moveSpeed;
                break;
            case 'a': 
                cameraPos[0] -= right[0] * moveSpeed;
                cameraPos[2] -= right[2] * moveSpeed;
                cameraTarget[0] -= right[0] * moveSpeed;
                cameraTarget[2] -= right[2] * moveSpeed;
                break;
            case 'd': 
                cameraPos[0] += right[0] * moveSpeed;
                cameraPos[2] += right[2] * moveSpeed;
                cameraTarget[0] += right[0] * moveSpeed;
                cameraTarget[2] += right[2] * moveSpeed;
                break;
            case 'q': 
                cameraPos[1] += moveSpeed;
                cameraTarget[1] += moveSpeed;
                break;
            case 'e': 
                cameraPos[1] -= moveSpeed;
                cameraTarget[1] -= moveSpeed;
                break;
            case 'arrowleft': 
                cameraAngleY -= rotSpeed;
                break;
            case 'arrowright': 
                cameraAngleY += rotSpeed;
                break;
        }
        const distance = Math.sqrt(
            Math.pow(cameraPos[0] - cameraTarget[0], 2) +
            Math.pow(cameraPos[2] - cameraTarget[2], 2)
        );
        cameraPos[0] = cameraTarget[0] + Math.sin(cameraAngleY) * distance;
        cameraPos[2] = cameraTarget[2] + Math.cos(cameraAngleY) * distance;

        drawScene();
    });

    function drawCube(viewingMatrix){
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  
      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);
      gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
      
      let modelMatrix = m4.identity();

      gl.uniformMatrix4fv(modelViewMatrixUniformLocation,false,modelMatrix);
      gl.uniformMatrix4fv(viewingMatrixUniformLocation,false,viewingMatrix);
      gl.uniformMatrix4fv(projectionMatrixUniformLocation,false,projectionMatrix);

      gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    function drawScene(){
      gl.clear(gl.COLOR_BUFFER_BIT);

      const viewingMatrix = m4.setViewingMatrix(cameraPos, cameraTarget, upVector);

      drawCube(viewingMatrix);

      const planeVerts = definePlane(20.0);
      const planeCols = definePlaneColors();

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, planeVerts, gl.STATIC_DRAW);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, planeCols, gl.STATIC_DRAW);
      gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

      const planeMatrix = m4.translate(m4.identity(), 0, -0.25, 0);
      gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, planeMatrix);
      gl.uniformMatrix4fv(viewingMatrixUniformLocation, false, viewingMatrix);
      gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

      gl.drawArrays(gl.TRIANGLES, 0, planeVerts.length / 3);

      drawAxes(gl, positionLocation, colorLocation,
               modelViewMatrixUniformLocation,
               viewingMatrixUniformLocation,
               projectionMatrixUniformLocation,
               viewingMatrix, projectionMatrix);
    }

    drawScene();
}

m4.setPerspectiveMatrix = function(fov, aspect, near, far) {
    let f = 1.0 / Math.tan(fov / 2);
    let rangeInv = 1.0 / (near - far);
    return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, (2 * near * far) * rangeInv, 0
    ];
};

function drawAxes(gl, posLoc, colLoc, uModel, uView, uProj, viewMat, projMat) {
    const axisVerts = new Float32Array([
        0,0,0, 1,0,0,
        0,0,0, 0,1,0,
        0,0,0, 0,0,1
    ]);
    const axisCols = new Float32Array([
        1,0,0, 1,0,0,
        0,1,0, 0,1,0,
        0,0,1, 0,0,1
    ]);
    const vbuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
    gl.bufferData(gl.ARRAY_BUFFER, axisVerts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);

    const cbuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuf);
    gl.bufferData(gl.ARRAY_BUFFER, axisCols, gl.STATIC_DRAW);
    gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colLoc);

    gl.uniformMatrix4fv(uModel, false, m4.identity());
    gl.uniformMatrix4fv(uView, false, viewMat);
    gl.uniformMatrix4fv(uProj, false, projMat);
    gl.drawArrays(gl.LINES, 0, 6);
}

function unitVector(v){ 
    let vModulus = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    return v.map(x => x/vModulus);
}

function degToRad(d) {
  return d * Math.PI / 180;
}

window.addEventListener('load', main);