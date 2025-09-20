// Vertex shader source code
const vertexShaderSource = `
  attribute vec2 a_position;
  uniform float u_pointSize;

  void main() {
    gl_Position = vec4(a_position, 0, 1);
    gl_PointSize = u_pointSize;
  }
`;

// Fragment shader source code
const fragmentShaderSource = `
  precision mediump float;
  uniform vec3 u_color;

  void main() {
    gl_FragColor = vec4(u_color,1.0);
  }
`;

let gl, canvas, VertexBuffer, colorUniformLocation, pointSizeUniformLocation;
let currentMode = null; 
let clickInicial = null;
let segundoClick = null;
let colorVector = [0.0,0.0,1.0];

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

function bresenham(x1, x2, y1, y2) {
    let points = [];
    
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);

    let sx = (x1 < x2) ? 1 : -1; 
    let sy = (y1 < y2) ? 1 : -1;

    let err = dx - dy;

    x = x1;
    y = y1;
    
    while(true){
        points.push({ x: x1, y: y1 });

        if (x1 == x2 && y1 == y1)
            break;

        let e2 = 2 * err;

        if (e2 > -dy){
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx){
            err += dx;
            y1 += sy;
        }
    }

    let coordenadas = [];
    for (let p of points) {
        let nx = (2 / canvas.width) * p.x - 1;
        let ny = (-2 / canvas.height) * p.y + 1;
        coordenadas.push(nx, ny);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordenadas), gl.STATIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);

    return points;
}

function bresenhamTriangle(v1, v2, v3){
    let points = [];

    points.push(...bresenham(v1.x, v2.x, v1.y, v2.y));
    points.push(...bresenham(v2.x, v3.x, v2.y, v3.y));
    points.push(...bresenham(v3.x, v1.x, v3.y, v1.y));

    let coordenadas = [];
    for (let p of points) {
        let nx = (2 / canvas.width) * p.x - 1;
        let ny = (-2 / canvas.height) * p.y + 1;
        coordenadas.push(nx, ny);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordenadas), gl.STATIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}

function newColor(key){
    switch(key){
        case '1':
          colorVector = [1.0, 0.0, 0.0];
          break;
        case '2':
          colorVector = [0.0, 1.0, 0.0];
          break;
        case '3':
          colorVector = [0.0, 0.0, 1.0];
          break;
        case '4':
          colorVector = [1.0, 1.0, 0.0];
          break;
        case '5':
          colorVector = [0.0, 1.0, 1.0];
          break;
        case '6':
          colorVector = [1.0, 0.0, 1.0];
          break;
        case '7':
          colorVector = [0.0, 0.0, 0.0];
          break;
        case '8':
          colorVector = [0.5, 0.5, 1.0];
          break;
        case '9':
          colorVector = [1.0, 0.5, 0.5];
          break;
    }

    gl.uniform3fv(colorUniformLocation,colorVector);
}

function mouseClick(event){
    console.log(event.offsetX,event.offsetY);

    if (currentMode === "line") {
        if (clickInicial == null){
            clickInicial = {x: event.offsetX, y: event.offsetY};
        } 
        else {
            let segundoClick = {x: event.offsetX, y: event.offsetY};
            bresenham(clickInicial.x, segundoClick.x, clickInicial.y, segundoClick.y);
            clickInicial = null;
        }
    } 
    else if (currentMode === "triangle") {
        if (clickInicial == null){
            clickInicial = {x: event.offsetX, y: event.offsetY}; 
        }
        else if (segundoClick == null){
            segundoClick = {x: event.offsetX, y: event.offsetY};
        }
        else {
            let terceiroClick = {x: event.offsetX, y: event.offsetY};
            bresenhamTriangle(clickInicial, segundoClick, terceiroClick);
            clickInicial = null;
            segundoClick = null;
        }
    }
}

function main(){
    canvas = document.getElementById('glCanvas1');
    gl = canvas.getContext('webgl');
    
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }
    
    const vertexShader = createShader1(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader1(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    const program = createProgram1(gl, vertexShader, fragmentShader);
    
    gl.useProgram(program);

    pointSizeUniformLocation = gl.getUniformLocation(program, "u_pointSize");
    gl.uniform1f(pointSizeUniformLocation, 5.0);

    const vertex = new Float32Array([
         0.0,  0.0
    ]);

    VertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform3fv(colorUniformLocation,colorVector);
  
    const bodyElement = document.querySelector("body");
    bodyElement.addEventListener("keydown",keyDown,false);
    canvas.addEventListener("mousedown",mouseClick,false);

    let pointSize = 5.0;

    function keyDown(event){
      if (event.key == 'r' || event.key == 'R'){
        currentMode = "line";
      }
      else if (event.key == 't' || event.key == 'T'){
        currentMode = "triangle";
      }
      else if (event.key == 'e' || event.key == 'E' || event.key == 'k' || event.key == 'K'){
        currentMode = "thickness";
      }
      else if (currentMode == "thickness" && event.key >= '1' && event.key <= '9'){
        switch(event.key){
            case '1':
                pointSize = 1.0;
                break;
            case '2':
                pointSize = 2.0;
                break;
            case '3':
                pointSize = 3.0;
                break;
            case '4':
                pointSize = 4.0;
                break;
            case '5':
                pointSize = 5.0;
                break;
            case '6':
                pointSize = 6.0;
                break;
            case '7':
                pointSize = 7.0;
                break;
            case '8':
                pointSize = 8.0;
                break;
            case '9':
                pointSize = 9.0;
                break;
        }

        gl.uniform1f(pointSizeUniformLocation, pointSize);
        drawPoint();

        currentMode = null;
      }
      else{
        newColor(event.key);
        drawPoint();
      }
    }

    function drawPoint(){
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, 1);
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    drawPoint();
}

main();