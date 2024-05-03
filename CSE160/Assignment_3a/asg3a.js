let VERT_SHADER_SOURCE = `
  precision mediump float;
  attribute vec2 attr_UV;
  varying vec2 var_UV;

  attribute vec4 Position;
  uniform mat4 ModelMatrix;
  uniform mat4 GlobalRotation;

  uniform mat4 ProjectionMatrix;
  uniform mat4 ViewMatrix;

  void main(){
    gl_Position = ProjectionMatrix * ViewMatrix * GlobalRotation * ModelMatrix * Position;
    var_UV = attr_UV;
  }`;

var FRAG_SHADER_SOURCE = `
precision mediump float;
varying vec2 var_UV;
uniform vec4 FragColor;
uniform sampler2D Sampler0;
uniform sampler2D Sampler1;
uniform int samplerType;

void main() {
  if (samplerType==0){
    gl_FragColor = texture2D(Sampler0, var_UV);
  }
  else if (samplerType==1){
    gl_FragColor = texture2D(Sampler1, var_UV);
  }
  else if (samplerType==2){
    gl_FragColor = FragColor;
  }
  else {
    gl_FragColor = vec4(1,0,0,1);
  }

}`;

let canvas;
let gl_ctx;
let currentAngle=[0.0,0.0];
let legAngle = 0;
let wingAngle = 35;
let maneAngle = 0;
let shift=true;
let g_animation = false;
let g_startTime = 0;
let elapsedTime = 0;

let attr_Position;
let unif_FragColor;
let unif_ModelMatrix;
let unif_AnimalGlobalRotation;
let preserveDrawingBuffer;

//new
let attr_UV;
let var_UV;
let unif_ProjectionMatrix;
let unif_ViewMatrix;
let unif_Sampler0;
let unif_Sampler1;
let unif_samplerType;


function main() {
  setupWebGL();
  connectVariablesToGLSL();
  setup_UI_elements();
  camera = new Camera();
  document.onkeydown = keydown;
  loadTexture("./lib/dirt.jpg", gl_ctx.TEXTURE0);
  loadTexture("./lib/sky.jpg", gl_ctx.TEXTURE1);
  renderScene();

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
  gl_ctx.clear(gl_ctx.COLOR_BUFFER_BIT | gl_ctx.DEPTH_BUFFER_BIT);
}
function connectVariablesToGLSL() {
  if (!initShaders(gl_ctx, VERT_SHADER_SOURCE, FRAG_SHADER_SOURCE)) {
      console.error("Failed to initialize shaders.");
      return;
  }
  attr_UV = gl_ctx.getAttribLocation(gl_ctx.program, 'attr_UV');
  unif_Sampler0 = gl_ctx.getUniformLocation(gl_ctx.program, 'Sampler0');
  gl_ctx.uniform1i(unif_Sampler0, 0);
  unif_Sampler1 = gl_ctx.getUniformLocation(gl_ctx.program, 'Sampler1');
  gl_ctx.uniform1i(unif_Sampler1, 1);

  unif_samplerType = gl_ctx.getUniformLocation(gl_ctx.program, 'samplerType');
  unif_ProjectionMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ProjectionMatrix');
  unif_ViewMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ViewMatrix');
  attr_Position = gl_ctx.getAttribLocation(gl_ctx.program, "Position");
  unif_ModelMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ModelMatrix');
  unif_FragColor = gl_ctx.getUniformLocation(gl_ctx.program, 'FragColor');
  unif_AnimalGlobalRotation = gl_ctx.getUniformLocation(gl_ctx.program, 'GlobalRotation');
  gl_ctx.uniformMatrix4fv(unif_AnimalGlobalRotation, false, new Matrix4().elements);
}

function setup_UI_elements() {
  document.getElementById("start").onclick = function () {
      g_animation = true;
      let animation_loop = (timestamp_milis) => {
          renderScene(timestamp_milis);
          requestAnimationFrame(animation_loop);
          };
      requestAnimationFrame(animation_loop);
  };
  document.getElementById("stop").onclick = function () {
      g_animation = false;
      renderScene();
  };
  document.getElementById("rotation_angle").addEventListener("input", function () {
      let stuff = new Matrix4().rotate(parseFloat(this.value), 0, 1, 0).elements;
      gl_ctx.uniformMatrix4fv(unif_AnimalGlobalRotation, false, stuff);
      renderScene();
  });
  document.getElementById("wing_slider").addEventListener("input", function () {
      g_animation = false;
      wingAngle = parseFloat(this.value);
      renderScene();
  });
  document.getElementById("head_slider").addEventListener("input", function () {
      g_animation = false; // Stop animation while manually adjusting
      headAngle = parseFloat(this.value);
      renderScene();
  });
  document.getElementById("mane_slider").addEventListener("input", function () {
      g_animation = false;
      maneAngle = parseFloat(this.value);
      renderScene();
  });
}

//texture
function loadTexture(url, texNum) {

  gl_ctx.activeTexture(texNum);

  const texture = gl_ctx.createTexture();  
  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, texture);
  const level = 0;
  const internalFormat = gl_ctx.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl_ctx.RGBA;
  const srcType = gl_ctx.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 0]); // opaque blue
  gl_ctx.texImage2D(
    gl_ctx.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel,
  );

  const image = new Image();
  image.onload = () => {
    gl_ctx.activeTexture(texNum);
    gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, texture);
    gl_ctx.texImage2D(
      gl_ctx.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image,
    );
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl_ctx.generateMipmap(gl_ctx.TEXTURE_2D);
    } else {
      gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
      gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
      gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
    }
  };
  image.src = url;
  
  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function drawTriangle3D(vertices) {
  var vertexBuffer = gl_ctx.createBuffer();
  var UVBuffer = gl_ctx.createBuffer();
  if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }
  gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, vertexBuffer);
  gl_ctx.bufferData(gl_ctx.ARRAY_BUFFER, new Float32Array(vertices), gl_ctx.DYNAMIC_DRAW);
  gl_ctx.vertexAttribPointer(attr_Position, 3, gl_ctx.FLOAT, false, 0, 0);
  gl_ctx.enableVertexAttribArray(attr_Position);

  gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, UVBuffer);
  gl_ctx.bufferData(gl_ctx.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 1.0, 1.0, 0.0]), gl_ctx.DYNAMIC_DRAW);
  gl_ctx.vertexAttribPointer(attr_UV, 2, gl_ctx.FLOAT, false, 0, 0);
  gl_ctx.enableVertexAttribArray(attr_UV);

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

let headAngle = Math.sin(elapsedTime * 3) * 10;
let beakAngle = Math.sin(elapsedTime * 3) * 10;
let eyeAngle = Math.sin(elapsedTime * 3) * 10;

function renderScene(timestamp_milis) {
  var projMat = camera.projMat;
  gl_ctx.uniformMatrix4fv(unif_ProjectionMatrix, false, projMat.elements);

  var viewMat = camera.viewMat;
  gl_ctx.uniformMatrix4fv(unif_ViewMatrix, false, viewMat.elements);

  var globalRotateMatrix = new Matrix4().rotate(currentAngle[0], 1.0, 0.0, 0.0);
  globalRotateMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);

  globalRotateMatrix.rotate(rotation_angle.value, 0.0, 1.0, 0.0);
  gl_ctx.uniformMatrix4fv(unif_AnimalGlobalRotation, false, globalRotateMatrix.elements);

  gl_ctx.clear(gl_ctx.COLOR_BUFFER_BIT | gl_ctx.DEPTH_BUFFER_BIT);
  //fps stuff
  let startTime = performance.now();

  if (g_animation) {
      g_startTime = performance.now() / 1000.0;
      elapsedTime = (timestamp_milis - g_startTime) / 1000.0;
      legAngle = Math.sin(elapsedTime * 2) * 20;
      wingAngle = Math.sin(elapsedTime * 5) * 90;
      headAngle = Math.sin(elapsedTime * 3) * 10;
      beakAngle = Math.sin(elapsedTime * 3) * 10;
      eyeAngle = Math.sin(elapsedTime * 3) * 10;
      maneAngle = Math.sin(elapsedTime * 3) * 10;
  }
  let head_color = [0.8, 0.6, 0.4, 1.0];
  let beak_color = [1.0, 0.6, 0.2, 1.0];
  let body_color = [0.6, 0.4, 0.2, 1.0];
  let leg_color = [1.0, 0.0, 0.0, 1.0]; 
  let mane_color = [1.0, 0.2, 0.2, 1.0];
  let mane_color2 = [1.0, 0.3, 0.2, 1.0];
  let wing_color = [1.0, 0.8, 0.6, 1.0]; 
  let eye_color = [0.0, 0.0, 0.0, 1.0];

  if (shift){
      headAngle = Math.sin(elapsedTime * 3) * 100;
      beakAngle = Math.sin(elapsedTime * 3) * 100;
      eyeAngle = Math.sin(elapsedTime * 3) * 100;
      maneAngle = Math.sin(elapsedTime * 3) * 100;
  }
  gl_ctx.uniform1i(unif_samplerType, 2);
  // head
  let head_matrix = new Matrix4()
      .rotate(headAngle, 0, 0, 1)
      .translate(-0.3, -0.3, 0.05)
      .scale(0.4, 0.8, 0.4);
  drawCube(head_color, head_matrix);

  // Mane (two parts)
  let mane1 = new Matrix4()
      .rotate(headAngle|maneAngle, 1, 0, 1)
      .translate(-0.25, 0.3, 0.2)
      .scale(0.3, 0.3, 0.1);
  drawCube(mane_color, mane1);

  let mane2 = new Matrix4()
      .rotate((headAngle*1.3|maneAngle*1.3), 1, 0, 1)
      .translate(-0.25, 0.6, 0.2)
      .scale(0.2, 0.1, 0.1);
  drawCube(mane_color2, mane2);

  let beak_matrix = new Matrix4()// beak
      .rotate(headAngle, 0, 0, 1)
      .translate(-0.6, 0.2, 0.15) 
      .scale(0.3, 0.1, 0.2);
  drawCube(beak_color, beak_matrix);
  
  //eye
  let L_eye_matrix = new Matrix4()
      .rotate(headAngle, 0, 0, 1)
      .translate(-0.35, 0.3, 0.1)
      .scale(0.1, 0.15, 0.1);
  drawCube(eye_color, L_eye_matrix);

  let R_eye_matrix = new Matrix4()
      .rotate(headAngle, 0, 0, 1)
      .translate(-0.35, 0.3, 0.3)
      .scale(0.1, 0.15, 0.1);
  drawCube(eye_color, R_eye_matrix);

  //body
  let body_matrix = new Matrix4()
      .translate(-0.2, -0.5, 0)
      .scale(0.7, 0.5, 0.5);
  drawCube(body_color, body_matrix);

  // leg
  let leg1 = new Matrix4()
      .scale(0.15, -0.5, 0.1)
      .translate(0.6, .7, 1)
      .rotate(-legAngle, 0, 0, 1); 
  drawCube(leg_color, leg1);

  let leg2 = new Matrix4()
      .scale(0.15, -0.5, 0.1)
      .translate(0.6, .7, 3)
      .rotate(legAngle, 0, 0, 1);
  drawCube(leg_color, leg2);

  //left wing
  let leftWingMatrix = new Matrix4()
      .translate(-0.1, -0.35, 0.1)
      .rotate(wingAngle, 0, 1, 0)
      .scale(0.7, 0.3, 0.1);
  drawCube(wing_color, leftWingMatrix);

  //right wing
  let rightWingMatrix = new Matrix4()
      .translate(-0.1, -0.35, 0.3)
      .rotate(-wingAngle, 0, 1, 0)
      .scale(0.7, 0.3, 0.1);
  drawCube(wing_color, rightWingMatrix);

  let duration = performance.now() - startTime;
  let fps_info = document.getElementById("fps")
  fps_info.innerHTML = " fps: " + Math.floor(1000 / duration);

  renderSkyCube();
  renderGroundGrass();
  renderDirtCubes();
}

function renderDirtCubes(){
  dirtCube([-2,-0.8,-2]); 
  dirtCube([-1,-0.8,-2]);
  dirtCube([-2,0.2,-2]);
  dirtCube([-2,-0.8,-1]);
}

function renderGroundGrass(){
  gl_ctx.uniform1i(unif_samplerType, 0);
  let green = [0, 1, 0, 1.0];
  let groundMatrix = new Matrix4()
    .translate(-50, -0.9, -50)
    .scale(100, .1, 100);
  drawCube(green, groundMatrix);
}

function renderSkyCube(){
  gl_ctx.uniform1i(unif_samplerType, 1);
  let blue = [0, 0, 1, 1.0];
  let skyMatrix = new Matrix4()
    .translate(-50, -50, -50)
    .scale(100, 100, 100);
  drawCube(blue, skyMatrix);
}

function dirtCube(coords){
  let color = [0,0,0,1];
  let dirtCube = new Matrix4()
    .translate(coords[0],coords[1],coords[2]);
  drawCube(color, dirtCube);
}


function keydown(event) {
  switch (event.key) {
    case 'w': // W
      camera.moveForward();
      break;
    case 'a': // A
    camera.moveRight();
      break;
    case 's': // S
      camera.moveBackwards();
      break;
    case 'd': // D
      camera.moveLeft();
      break;
    case 'q': // Q
      camera.panLeft();
      break;
    case 'e': // E
      camera.panRight();
      break;
    default:
      break;
  }
  renderScene();
}

function shift_press(event) {
  if (event.shiftKey) {
      shift = true;
  } else {
      shift = false;
  }
}

window.onload = main;
