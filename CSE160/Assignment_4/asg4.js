let VERT_SHADER_SOURCE = `
  precision mediump float;
  attribute vec2 attr_UV;
  varying vec2 var_UV;
  attribute vec4 Position;
  uniform mat4 ModelMatrix;
  uniform mat4 ProjectionMatrix;
  uniform mat4 ViewMatrix;

  attribute vec3 attr_Normal;
  varying vec3 var_Normal;
  varying vec4 var_VertPos;

  void main(){
    gl_Position = ProjectionMatrix * ViewMatrix * ModelMatrix * Position;
    var_UV = attr_UV;
    var_Normal = attr_Normal;
    var_VertPos = ModelMatrix * Position;
  }`;

var FRAG_SHADER_SOURCE = `
precision mediump float;
varying vec2 var_UV;
uniform vec4 FragColor;
uniform sampler2D Sampler0;
uniform sampler2D Sampler1;
uniform sampler2D Sampler2;
uniform int samplerType;

uniform vec3 unif_cameraPos;
varying vec3 var_Normal;
varying vec4 var_VertPos;
uniform bool unif_lightOn;
uniform vec4 unif_lightColor;
uniform vec3 unif_lightPos;

uniform bool redSpecular;
uniform bool normalize_bool;


void main() {
  if (samplerType==0){
    gl_FragColor = texture2D(Sampler0, var_UV);
  }
  else if (samplerType==1){
    gl_FragColor = texture2D(Sampler1, var_UV);
  }
  else if (samplerType==2){
    gl_FragColor = texture2D(Sampler2, var_UV);
  }
  else if (samplerType==3){
    gl_FragColor = FragColor;
  }
  else {
    gl_FragColor = vec4(1,0,0,1);
  }

  vec3 lightVector = unif_lightPos - vec3(var_VertPos);
  float r = length(lightVector);
  vec3 L = normalize(lightVector);
  vec3 N = normalize(var_Normal);
  float nDotL = max(dot(N,L), 0.0);
 
  vec3 R = reflect(L,N);
  vec3 E = normalize(unif_cameraPos - vec3(var_VertPos));
  float specular = pow(max(dot(E,R), 0.0), 3.0) * 0.8;
  vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL *0.7;
  vec3 ambient = vec3(gl_FragColor) * 0.2;
  if(unif_lightOn){
    gl_FragColor =vec4(specular+diffuse+ambient,1.0)*unif_lightColor;
  }else{
    gl_FragColor =vec4(diffuse+ambient,1.0);
  }
  if (redSpecular == true){
    gl_FragColor = vec4(specular, 0.0, 0.0, 1.0);
  }
  else if (normalize_bool == true){
    gl_FragColor = vec4(var_Normal, 1.0);
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
let preserveDrawingBuffer;

let attr_UV;
let var_UV;
let unif_ProjectionMatrix;
let unif_ViewMatrix;
let unif_Sampler0;
let unif_Sampler1;
let unif_Sampler2;
let unif_samplerType;
let camera;

//new
let attr_Normal;
let var_Normal;
let var_VertPos;
let unif_cameraPos;
let unif_lightOn;
let lightOn = false;

let unif_lightColor = [1,1,1,1];

let unif_lightPos;
let lightPos = [0, 10, 0];
let normalize_bool = false;
let redSpecular = false;

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  setup_UI_elements();
  camera = new Camera();
  cameraMove(canvas, currentAngle);
  document.onkeydown = keydown;
  loadTexture("./lib/dirt.jpg", gl_ctx.TEXTURE0);
  loadTexture("./lib/sky.jpg", gl_ctx.TEXTURE1);
  loadTexture("./lib/grass.jpg", gl_ctx.TEXTURE2);
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
  unif_Sampler2 = gl_ctx.getUniformLocation(gl_ctx.program, 'Sampler2');
  gl_ctx.uniform1i(unif_Sampler2, 2);
  unif_samplerType = gl_ctx.getUniformLocation(gl_ctx.program, 'samplerType');
  unif_ProjectionMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ProjectionMatrix');
  unif_ViewMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ViewMatrix');
  attr_Position = gl_ctx.getAttribLocation(gl_ctx.program, "Position");
  unif_ModelMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ModelMatrix');
  unif_FragColor = gl_ctx.getUniformLocation(gl_ctx.program, 'FragColor');

  attr_Normal = gl_ctx.getAttribLocation(gl_ctx.program, 'attr_Normal');
  unif_cameraPos = gl_ctx.getUniformLocation(gl_ctx.program, 'unif_cameraPos');
  unif_lightOn = gl_ctx.getUniformLocation(gl_ctx.program, 'unif_lightOn');
  unif_lightColor = gl_ctx.getUniformLocation(gl_ctx.program, 'unif_lightColor');
  unif_lightPos = gl_ctx.getUniformLocation(gl_ctx.program, 'unif_lightPos');

  normalize_bool = gl_ctx.getUniformLocation(gl_ctx.program, 'normalize_bool');
  redSpecular = gl_ctx.getUniformLocation(gl_ctx.program, 'redSpecular')

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
  document.getElementById("camera_reset").onclick = function () {
    camera = new Camera;
    renderScene();
  };
  document.getElementById("wing_slider").addEventListener("input", function () {
      g_animation = false;
      wingAngle = parseFloat(this.value);
      renderScene();
  });
  document.getElementById("head_slider").addEventListener("input", function () {
      g_animation = false;
      headAngle = parseFloat(this.value);
      renderScene();
  });
  document.getElementById("mane_slider").addEventListener("input", function () {
      g_animation = false;
      maneAngle = parseFloat(this.value);
      renderScene();
  });

  document.getElementById('Normalize_On').onclick = function() {
    gl_ctx.uniform1i(normalize_bool, true);
    renderScene();
  };
  
  document.getElementById('Normalize_Off').onclick = function() {
    gl_ctx.uniform1i(normalize_bool, false);
    renderScene();
  };
  
  document.getElementById('lightToggle').onclick = function() {
    gl_ctx.uniform1i(unif_lightOn, !unif_lightOn);
    renderScene();
  };
  
  document.getElementById('lightPosX').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) {
        lightPos[0] = (this.value);
        renderScene();
    }
  });
  document.getElementById('lightPosY').addEventListener('mousemove', function (ev) {
      if (ev.buttons == 1) {
        lightPos[1] = (this.value);
          renderScene();
      }
  });
  document.getElementById('lightPosZ').addEventListener('mousemove', function (ev) {
      if (ev.buttons == 1) {
        lightPos[2] = (this.value);
        renderScene();
      }
  });
}

function cameraMove(canvas, currentAngle) {
  let dragging = false;
  let lastX = -1;
  let lastY = -1; 
  document.addEventListener('mousedown', function(ev) {
      if (ev.target === canvas) {
          dragging = true;
          lastX = ev.clientX;
          lastY = ev.clientY;
      }
  });
  document.addEventListener('mouseup', function(ev) {
      dragging = false;
  });
  document.addEventListener('mousemove', function(ev) {
      if (dragging) {
          let factor = 500 / canvas.height;
          let dy = factor * (ev.clientY - lastY);
          let dx = factor * (ev.clientX - lastX);
          lastX = ev.clientX;
          lastY = ev.clientY;
          let length = (dx*dx) + (dy*dy);
          console.log(dx, dy);
          if(length != 0){
            let rotationMatrix = new Matrix4()
              .rotate(length, -dy, dx, 0);
            camera.rotateBy(rotationMatrix);
            renderScene();
         }
      }
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
    renderScene();
  };
  image.src = url;
  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

// function drawTriangle3DUV(vertices, uvCoords) {
//   var vertexBuffer = gl_ctx.createBuffer();
//   var UVBuffer = gl_ctx.createBuffer();
//   if (!vertexBuffer) {
//       console.log('Failed to create the buffer object');
//       return -1;
//   }
//   gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, vertexBuffer);
//   gl_ctx.bufferData(gl_ctx.ARRAY_BUFFER, new Float32Array(vertices), gl_ctx.DYNAMIC_DRAW);
//   gl_ctx.vertexAttribPointer(attr_Position, 3, gl_ctx.FLOAT, false, 0, 0);
//   gl_ctx.enableVertexAttribArray(attr_Position);

//   gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, UVBuffer);
//   gl_ctx.bufferData(gl_ctx.ARRAY_BUFFER, new Float32Array(uvCoords), gl_ctx.DYNAMIC_DRAW);
//   gl_ctx.vertexAttribPointer(attr_UV, 2, gl_ctx.FLOAT, false, 0, 0);
//   gl_ctx.enableVertexAttribArray(attr_UV);
//   gl_ctx.drawArrays(gl_ctx.TRIANGLES, 0, 3);
// }

function drawTriangle3DUVNormal(vertices, uv, normals) {
  var vertexBuffer = gl_ctx.createBuffer();
  if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }
  gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, vertexBuffer);
  gl_ctx.bufferData(gl_ctx.ARRAY_BUFFER, new Float32Array(vertices), gl_ctx.DYNAMIC_DRAW);
  gl_ctx.vertexAttribPointer(attr_Position, 3, gl_ctx.FLOAT, false, 0, 0);
  gl_ctx.enableVertexAttribArray(attr_Position);
  var uvBuffer = gl_ctx.createBuffer();
  if (!uvBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }
  gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, uvBuffer);
  gl_ctx.bufferData(gl_ctx.ARRAY_BUFFER, new Float32Array(uv), gl_ctx.DYNAMIC_DRAW);
  gl_ctx.vertexAttribPointer(attr_UV, 2, gl_ctx.FLOAT, false, 0, 0);
  gl_ctx.enableVertexAttribArray(attr_UV);

  var normalBuffer = gl_ctx.createBuffer();
  if (!normalBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }
  gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, normalBuffer);
  gl_ctx.bufferData(gl_ctx.ARRAY_BUFFER, new Float32Array(normals), gl_ctx.DYNAMIC_DRAW);
  gl_ctx.vertexAttribPointer(attr_Normal, 3, gl_ctx.FLOAT, false, 0, 0);
  gl_ctx.enableVertexAttribArray(attr_Normal);
  gl_ctx.drawArrays(gl_ctx.TRIANGLES, 0, vertices.length / 3);
  g_vertexBuffer = null;
}

function drawCube(rgba, matrix){
  gl_ctx.uniform4f(unif_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  gl_ctx.uniformMatrix4fv(unif_ModelMatrix, false, matrix.elements);
  drawTriangle3DUVNormal([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0], [1, 0, 0, 1, 0, 0], [0, 0, -1, 0, 0, -1, 0, 0, -1]);
  drawTriangle3DUVNormal([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0], [1, 0, 1, 1, 0, 1], [0, 0, -1, 0, 0, -1, 0, 0, -1]);
  drawTriangle3DUVNormal([0, 0, 1, 1, 1, 1, 1, 0, 1], [0, 0, 1, 1, 1, 0], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
  drawTriangle3DUVNormal([0, 0, 1, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
  drawTriangle3DUVNormal([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
  drawTriangle3DUVNormal([0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
  drawTriangle3DUVNormal([0, 0, 0, 0, 0, 1, 1, 0, 1], [0, 0, 0, 1, 1, 1], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
  drawTriangle3DUVNormal([0, 0, 0, 1, 0, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
  drawTriangle3DUVNormal([0, 0, 0, 0, 1, 0, 0, 0, 1], [0, 0, 0, 1, 1, 0], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
  drawTriangle3DUVNormal([0, 1, 1, 0, 1, 0, 0, 0, 1], [1, 1, 0, 1, 1, 0], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
  drawTriangle3DUVNormal([1, 0, 0, 1, 1, 1, 1, 1, 0], [1, 0, 0, 1, 1, 1], [1, 0, 0, 1, 0, 0, 1, 0, 0]);
  drawTriangle3DUVNormal([1, 0, 0, 1, 1, 1, 1, 0, 1], [1, 0, 0, 1, 0, 0], [1, 0, 0, 1, 0, 0, 1, 0, 0]);
}

function drawSphere(rgba, matrix){
  gl_ctx.uniform4f(unif_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  gl_ctx.uniformMatrix4fv(unif_ModelMatrix, false, matrix.elements);
  let d = Math.PI / 10;
  let dd = Math.PI / 10;
  let sin = Math.sin;
  let cos = Math.cos;
  for (var t = 0; t < Math.PI; t += d) {
    for (var r = 0; r < 2 * Math.PI; r += d) {
      var p1 = [sin(t) * cos(r), sin(t) * sin(r), cos(t)];
      var p2 = [sin(t + dd) * cos(r), sin(t + dd) * sin(r), cos(t + dd)];
      var p3 = [sin(t) * cos(r + dd), sin(t) * sin(r + dd), cos(t)];
      var p4 = [sin(t + dd) * cos(r + dd), sin(t + dd) * sin(r + dd), cos(t + dd)];
      var uv1 = [t / Math.PI, r / (2 * Math.PI)];
      var uv2 = [(t + dd) / Math.PI, r / (2 * Math.PI)];
      var uv3 = [t / Math.PI, (r + dd) / (2 * Math.PI)];
      var uv4 = [(t + dd) / Math.PI, (r + dd) / (2 * Math.PI)];
      var v = [];
      var uv = [];
      v = v.concat(p1);
      uv = uv.concat(uv1);
      v = v.concat(p2);
      uv = uv.concat(uv2);
      v = v.concat(p4);
      uv = uv.concat(uv4);
      gl_ctx.uniform4f(unif_FragColor, 1, 1, 1, 1);
      drawTriangle3DUVNormal(v, uv, v);
      v = [];
      uv = [];
      v = v.concat(p1);
      uv = uv.concat(uv1);
      v = v.concat(p4);
      uv = uv.concat(uv4);
      v = v.concat(p3);
      uv = uv.concat(uv3);
      gl_ctx.uniform4f(unif_FragColor, 1, 0, 0, 1);
      drawTriangle3DUVNormal(v, uv, v);
    }
  }
}


let headAngle = Math.sin(elapsedTime * 3) * 10;
let beakAngle = Math.sin(elapsedTime * 3) * 10;
let eyeAngle = Math.sin(elapsedTime * 3) * 10;

function renderScene(timestamp_milis) {
  var projectionMatrix = camera.projectionMatrix;
  gl_ctx.uniformMatrix4fv(unif_ProjectionMatrix, false, projectionMatrix.elements);

  var viewMatrix = camera.viewMatrix;
  gl_ctx.uniformMatrix4fv(unif_ViewMatrix, false, viewMatrix.elements);

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
    unif_lightPos[0] = Math.cos(elapsedTime * 3) *10;
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

  gl_ctx.uniform3f(unif_lightPos, lightPos[0], lightPos[1], lightPos[2]);
  gl_ctx.uniform3f(unif_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

  //light1
  gl_ctx.uniform1i(unif_samplerType, 3);
  let color = [1,1,0,1];
  let sunCube = new Matrix4()
    .translate(lightPos[0], lightPos[1], lightPos[2])
    .scale(-1, -1, -1)
    // .rotate(headAngle,1,1,1);
  drawCube(color, sunCube);
  console.log(lightPos[0], lightPos[1], lightPos[2])
  
  gl_ctx.uniform1i(unif_samplerType, 3);
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


  sphere([0,5,0]);
}

function sphere(coords) {
  gl_ctx.uniform1i(unif_samplerType, 3);
  
  let color = [1,1,1,1];
  let sphere = new Matrix4()
    .translate(coords[0], coords[1],coords[2]);
  drawSphere(color, sphere);
}


function renderDirtCubes() {
  dirtCube([1, -0.8, 11]);
  dirtCube([2, -0.8,11]);
  dirtCube([1, -0.8, 12]);
  dirtCube([1, 0.2, 11]);
}

function renderGroundGrass(){
  gl_ctx.uniform1i(unif_samplerType, 2);
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
    .scale(100, 100, 100)

  drawCube(blue, skyMatrix);
}

function dirtCube(coords){
  gl_ctx.uniform1i(unif_samplerType, 0);
  let color = [0,0,0,1];
  let dirtCube = new Matrix4()
    .translate(coords[0],coords[1],coords[2]);
  drawCube(color, dirtCube);
}

function GrassCube(coords){
  gl_ctx.uniform1i(unif_samplerType, 2);
  let color = [0,0,0,1];
  let GrassCube = new Matrix4()
    .translate(coords[0],coords[1],coords[2]);
  drawCube(color, GrassCube);
}

function keydown(event) {
  switch (event.key) {
    case 'w':
      camera.moveForward();
      break;
    case 'a':
    camera.moveRight();
      break;
    case 's':
      camera.moveBackwards();
      break;
    case 'd':
      camera.moveLeft();
      break;
    case 'q':
      camera.panLeft();
      break;
    case 'e':
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
