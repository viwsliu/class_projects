function main() {
  canvas = document.getElementById('asg0');
  board = canvas.getContext('2d');
  board.fillStyle = 'black';
  board.fillRect(0, 0, 400, 400);
}

function setupWebGL(){ //get the canvas and gl context

}

function connectVariablesToGLSL () { //compile the shader programs, attach the javascript variables to the GLSL variables
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders.");
    return;
  }
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
  }
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
      console.log("Failed ti get the storage location of u_Size");
      return;
  }
}

function handleClicks(){ // based on some data structure that is holding all the information about what to draw, actually draw all the shapes.

}

function renderAllShapes() { // there should be a specific function that handles a click, but doesn’t have extra code that doesn’t belong there (like initialization and rendering)

}