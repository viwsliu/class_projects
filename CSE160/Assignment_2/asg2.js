let VERT_SHADER_SOURCE = `
    attribute vec2 Position;
    uniform float Size;
    void main(){
        gl_Position = vec4(Position, 0, 1);
        gl_PointSize = Size;
    }`;

let FRAG_SHADER_SOURCE = `
    precision mediump float;
    uniform vec4 FragColor;
    void main() {
      gl_FragColor = FragColor;
    }`;


let canvas;
let gl_ctx;
let attr_Position;
let unif_FragColor;
let unif_Size;
let unif_ModelMatrix;
let unif_GlobalRotateMatrix;

let g_animation = false;


function main() {
    setupWebGL();
    connectVariablesToGLSL();
    setup_UI_elements();
    canvas.onmousedown = click;
    canvas.onmousemove = function (ev) {
        if (ev.buttons == 1) {
            click(ev);
        }
    };
    gl_ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    gl_ctx.clear(gl_ctx.COLOR_BUFFER_BIT);
}

function setupWebGL() { //get the canvas and gl context
    canvas = document.getElementById('webgl');
    gl_ctx = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl_ctx) {
        console.error("setupWebGL() failed");
        return;
    }
}

function connectVariablesToGLSL() {
    if (!initShaders(gl_ctx, VERT_SHADER_SOURCE, FRAG_SHADER_SOURCE)) {
        console.error("Failed to initialize shaders.");
        return;
    }
    attr_Position = gl_ctx.getAttribLocation(gl_ctx.program, "Position");
    unif_FragColor = gl_ctx.getUniformLocation(gl_ctx.program, "FragColor");
    unif_Size = gl_ctx.getUniformLocation(gl_ctx.program, "Size");
}

function setup_UI_elements() {
    document.getElementById("start").onclick = function () {
        g_animation = true;
    };
    document.getElementById("stop").onclick = function () {
        g_animation = false;
    };

    document.getElementById("slider_1").addEventListener("mousemove", function () {
        renderAllShapes();
    });
    document.getElementById("slider_2").addEventListener("mousemove", function () {
        renderAllShapes();
    });
    document.getElementById("slider_3").addEventListener("mousemove", function () {
        renderAllShapes();
    });
    document.getElementById("slider_4").addEventListener("mousemove", function () {
        renderAllShapes();
    });
    document.getElementById("slider_5").addEventListener("mousemove", function () {
        renderAllShapes();
    });

}



function drawCircle(){

}

function drawCube(matrix){

}




gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);