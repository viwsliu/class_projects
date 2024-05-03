let VERT_SHADER_SOURCE = `
  precision mediump float;
  attribute vec2 attr_UV;
  varying vec2 var_UV;

  attribute vec4 Position;
  uniform mat4 ModelMatrix;
  uniform mat4 GlobalRotation;

  uniform mat4 ViewMatrix;
  uniform mat4 ProjectionMatrix; 

  void main(){
      gl_Position = ProjectionMatrix * ViewMatrix * GlobalRotation * ModelMatrix * Position;
      v_UV = a_UV;
  }`;

let FRAG_SHADER_SOURCE = `
  precision mediump float;
  varying vec2 var_UV;
  uniform sampler2D Sampler0;
  uniform sampler2D Sampler1;
  uniform int unif_whichTexture;

  uniform vec4 FragColor;

  void main() {
    if (unif_whichTexture == -2) {                   // Use color
      gl_FragColor = u_FragColor;
    } else if (unif_whichTexture == -1) {            // Use UV debug color
      gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if (unif_whichTexture == 0) {             // Use texture0
      gl_FragColor = texture2D(Sampler0, var_UV);
    } else if (unif_whichTexture == -3) {             // Use texture1
      gl_FragColor = texture2D(Sampler1, var_UV);
    }    else {                                      // Error, put Redish
      FragColor = vec4(1,.2,.2,1);
    }
  }`;


let canvas;
let gl_ctx;

let attr_Position;
let unif_FragColor;
let unif_ModelMatrix;
let unif_GlobalRotation;
let preserveDrawingBuffer;

//new vars
let unif_Sampler0;
let unif_Sampler1;
let unif_whichTexture;
let var_UV;
let attr_UV;
let unif_ViewMatrix;
let unif_ProjectionMatrix;

function main(){
  setupWebGL();
  connectVariablesToGLSL();

  // setup_UI_elements();
}

function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl_ctx = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl_ctx) {
      console.error("setupWebGL() failed");
      return;
  }
  gl_ctx.clearColor(1.0, 0.5, 0.5, 1.0);
  gl_ctx.enable(gl_ctx.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  if (!initShaders(gl_ctx, VERT_SHADER_SOURCE, FRAG_SHADER_SOURCE)) {
      console.error("Failed to initialize shaders.");
      return;
  }
  attr_UV = gl_ctx.getAttribLocation(gl_ctx.program, 'attr_UV');
  var_UV = gl_ctx.getAttribLocation(gl_ctx.program, 'var_UV');
  attr_Position = gl_ctx.getAttribLocation(gl_ctx.program, "Position");
  unif_whichTexture = gl_ctx.getUniformLocation(gl_ctx.program, 'unif_whichTexture');
  unif_ModelMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ModelMatrix');
  unif_FragColor = gl_ctx.getUniformLocation(gl_ctx.program, 'FragColor');
  unif_ViewMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ViewMatrix');
  unif_ProjectionMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ProjectionMatrix');
  unif_Sampler0 = gl_ctx.getUniformLocation(gl_ctx.program, 'Sampler0');
  unif_Sampler1 = gl_ctx.getUniformLocation(gl_ctx.program, 'Sampler1');
  unif_GlobalRotation = gl_ctx.getUniformLocation(gl_ctx.program, 'GlobalRotation');
  gl_ctx.uniformMatrix4fv(unif_GlobalRotation, false, new Matrix4().elements);
}


document.addEventListener('keydown', function(event) {
  handleKeyDown(event);
});

function initSky() {
  var image = new Image();
  image.onload = function () {
      sendImagetoTEXTURE0(image);
  };
  image.src = 'sky.jpg';
  return true;
}

function sendImagetoTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
      console.log('Failed to create the texture object');
      return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
  console.log('finished loadTexture');
}


function initGround(){
  var image = new Image();
  image.onload = function () {
      sendImagetoTEXTURE1(image);
  };
  image.src = 'grass.jpg';
  return true;
}

function sendImagetoTEXTURE1(image1) {
  var texture = gl.createTexture();
  if (!texture) {
      console.log('Failed to create the texture object');
      return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
  gl.uniform1i(u_Sampler1, 1);
  console.log('finished loadTexture');
}






function drawTriangle3D(vertices) {
  var vertexBuffer = gl_ctx.createBuffer();
  if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }
  gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, vertexBuffer);
  gl_ctx.bufferData(gl_ctx.ARRAY_BUFFER, new Float32Array(vertices), gl_ctx.DYNAMIC_DRAW);
  gl_ctx.vertexAttribPointer(attr_Position, 3, gl_ctx.FLOAT, false, 0, 0);
  gl_ctx.enableVertexAttribArray(attr_Position);
  gl_ctx.drawArrays(gl_ctx.TRIANGLES, 0, 3);
}

function drawCube(rgba, matrix){
  gl_ctx.uniform4f(unif_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  gl_ctx.uniformMatrix4fv(unif_ModelMatrix, false, matrix.elements);
  drawTriangle3D([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);
  drawTriangle3D([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0]);
  drawTriangle3D([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);
  drawTriangle3D([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
  drawTriangle3D([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
  drawTriangle3D([0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
  drawTriangle3D([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0]);
  drawTriangle3D([1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0]);
  drawTriangle3D([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]);
  drawTriangle3D([0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
  drawTriangle3D([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
  drawTriangle3D([1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0]);
}








function handleKeyDown(event) {
  // Check which key is pressed
  switch (event.key) {
    case 'w':
      console.log('forward');
      break;
    case 'a':
      console.log('left');
      break;
    case 's':
      console.log('back');
      break;
    case 'd':
      console.log('right');
      break;
    default:
      break;
  }
}


window.onload = main();