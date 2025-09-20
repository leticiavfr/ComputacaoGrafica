// Vertex shader source code
const vertexShaderSource = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0, 1);
    gl_PointSize = 5.0;
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

let gl, canvas, VertexBuffer, colorUniformLocation;
let vertices = [];

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

function drawCircleBresenham(cx, cy, radius) {
    vertices = [];

    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    while (x <= y) {
        const points = [
            [(2*(cx + x)/canvas.width)-1, 1-(2*(cy + y)/canvas.height)],
            [(2*(cx - x)/canvas.width)-1, 1-(2*(cy + y)/canvas.height)],
            [(2*(cx + x)/canvas.width)-1, 1-(2*(cy - y)/canvas.height)],
            [(2*(cx - x)/canvas.width)-1, 1-(2*(cy - y)/canvas.height)],
            [(2*(cx + y)/canvas.width)-1, 1-(2*(cy + x)/canvas.height)],
            [(2*(cx - y)/canvas.width)-1, 1-(2*(cy + x)/canvas.height)],
            [(2*(cx + y)/canvas.width)-1, 1-(2*(cy - x)/canvas.height)],
            [(2*(cx - y)/canvas.width)-1, 1-(2*(cy - x)/canvas.height)]
        ];

        for (let p of points) {
            vertices.push(...p); 
        }

        if (d < 0) {
            d += 4 * x + 6;
        } else {
            d += 4 * (x - y) + 10;
            y--;
        }
        x++;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
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

    let colorVector = [0.0,0.0,1.0];

    colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform3fv(colorUniformLocation,colorVector);

    canvas.addEventListener("mousedown",mouseClick,false);

    function mouseClick(event){
      console.log(event.offsetX,event.offsetY);

      drawCircleBresenham(event.offsetX, event.offsetY, 30.0);
    }
  
    const bodyElement = document.querySelector("body");
    bodyElement.addEventListener("keydown",keyDown,false);
  
    function keyDown(event){
      newColor(event.key);
      drawPoint();
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