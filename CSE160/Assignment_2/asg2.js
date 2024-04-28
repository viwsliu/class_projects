let VERT_SHADER_SOURCE = `
    attribute vec4 Position;
    uniform mat4 ModelMatrix;
    uniform mat4 GlobalRotation;
    void main(){
        gl_Position = GlobalRotation * ModelMatrix * Position;
    }`;

let FRAG_SHADER_SOURCE = `
    precision mediump float;
    uniform vec4 FragColor;
    void main() {
      gl_FragColor = FragColor;
    }`;

let canvas;
let gl_ctx;
let g_animation = false;
let currentAngle=[0.0,0.0];
let legAngle = 0;
let wingAngle = 35;
let shift=true;


let g_startTime = 0;
let elapsedTime = 0;

let attr_Position;
let unif_FragColor;
let unif_ModelMatrix;
let unif_AnimalGlobalRotation;

let preserveDrawingBuffer;

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    setup_UI_elements();
    cameraMove(canvas, currentAngle);
    renderScene()
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
    attr_Position = gl_ctx.getAttribLocation(gl_ctx.program, "Position");
    unif_ModelMatrix = gl_ctx.getUniformLocation(gl_ctx.program, 'ModelMatrix');
    unif_FragColor = gl_ctx.getUniformLocation(gl_ctx.program, 'FragColor');
    unif_AnimalGlobalRotation = gl_ctx.getUniformLocation(gl_ctx.program, 'GlobalRotation');
    gl_ctx.uniformMatrix4fv(unif_AnimalGlobalRotation, false, new Matrix4().elements);
}

function cameraMove(canvas, currentAngle) {
    let dragging = false;
    let lastX = -1;
    let lastY = -1; 
    canvas.onmousedown = function(ev) {
        var x = ev.clientX, y = ev.clientY;
        var bound = ev.target.getBoundingClientRect();
        if ((bound.left <= x) && (x < bound.right) && (bound.top <= y) && (y < bound.bottom)) {
            lastX = x;
            lastY = y;
            dragging = true;
        }
    };
    canvas.onmouseup = function(ev) {dragging = false;};
    canvas.onmousemove = function(ev) { 
        var x = ev.clientX, y = ev.clientY;
        if (dragging) {
            var factor = 500 / canvas.height;
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + (factor * (y - lastY)), 90.0), -90.0);
            currentAngle[1] = currentAngle[1] + factor * (x - lastX);
            var rotationMatrix = new Matrix4()
                .rotate(currentAngle[0], 1, 0, 0) 
                .rotate(currentAngle[1], 0, 1, 0); 
            gl_ctx.uniformMatrix4fv(unif_AnimalGlobalRotation, false, rotationMatrix.elements);
            renderScene(); 
        }
        lastX = x, lastY = y;
    };
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

function drawCube(matrix){
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

function colorCube(rgba){
    gl_ctx.uniform4f(unif_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
}


function renderScene(timestamp_milis) {
    gl_ctx.clear(gl_ctx.COLOR_BUFFER_BIT | gl_ctx.DEPTH_BUFFER_BIT);
    if (g_animation) {
        g_startTime = performance.now() / 1000.0;
        elapsedTime = (timestamp_milis - g_startTime) / 1000.0;
        legAngle = Math.sin(elapsedTime * 2) * 20;
        wingAngle = Math.sin(elapsedTime * 5) * 90;
        
        
        
    }


    let head_color = [0.8, 0.6, 0.4, 1.0];
    let beak_color = [1.0, 0.6, 0.2, 1.0];
    let body_color = [0.6, 0.4, 0.2, 1.0];
    let leg_color = [1.0, 0.0, 0.0, 1.0]; 
    let wing_color = [1.0, 0.8, 0.6, 1.0]; 
    let eye_color = [0.0, 0.0, 0.0, 1.0]; 

    // Head
    if (shift){
        headAngle = Math.sin(elapsedTime * 3) * 100;
        let head_matrix = new Matrix4()
        .rotate(headAngle, 0, 0, 1)
        .translate(-0.3, -0.3, 0.05)
        .scale(0.4, 0.8, 0.4);
        drawCube(head_color, head_matrix);

    beakAngle = Math.sin(elapsedTime * 3) * 100;
        let beak_matrix = new Matrix4()
        .rotate(beakAngle, 0, 0, 1)
        .translate(-0.6, 0.2, 0.15) 
        .scale(0.3, 0.1, 0.2);
    drawCube(beak_color, beak_matrix);

    eyeAngle = Math.sin(elapsedTime * 3) * 100;
    let L_eye_matrix = new Matrix4()
        .rotate(eyeAngle, 0, 0, 1)
        .translate(-0.35, 0.3, 0.1)
        .scale(0.1, 0.15, 0.1);
    drawCube(eye_color, L_eye_matrix);

    let R_eye_matrix = new Matrix4()
    .rotate(eyeAngle, 0, 0, 1)
        .translate(-0.35, 0.3, 0.3)
        .scale(0.1, 0.15, 0.1);
    drawCube(eye_color, R_eye_matrix);

    }

    if (!shift){
        headAngle = Math.sin(elapsedTime * 3) * 10;
        let head_matrix = new Matrix4()
            .rotate(headAngle, 0, 0, 1)
            .translate(-0.3, -0.3, 0.05)
            .scale(0.4, 0.8, 0.4);
        drawCube(head_color, head_matrix);

        beakAngle = Math.sin(elapsedTime * 3) * 10;
        let beak_matrix = new Matrix4()
            .rotate(beakAngle, 0, 0, 1)
            .translate(-0.6, 0.2, 0.15) 
            .scale(0.3, 0.1, 0.2);
        drawCube(beak_color, beak_matrix);

        eyeAngle = Math.sin(elapsedTime * 3) * 10;
        let L_eye_matrix = new Matrix4()
        .rotate(eyeAngle, 0, 0, 1)
        .translate(-0.35, 0.3, 0.1)
        .scale(0.1, 0.15, 0.1);
    drawCube(eye_color, L_eye_matrix);

    let R_eye_matrix = new Matrix4()
    .rotate(eyeAngle, 0, 0, 1)
        .translate(-0.35, 0.3, 0.3)
        .scale(0.1, 0.15, 0.1);
    drawCube(eye_color, R_eye_matrix);

    }

    // Body
    let body_matrix = new Matrix4()
        .translate(-0.2, -0.5, 0)
        .scale(0.7, 0.5, 0.5);
    drawCube(body_color, body_matrix);

    // legs
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

    // Left Wing
    let leftWingMatrix = new Matrix4()
        .translate(-0.1, -0.35, 0.1)
        .rotate(wingAngle, 0, 1, 0)
        .scale(0.7, 0.3, 0.1);
    drawCube(wing_color, leftWingMatrix);

    // Right Wing
    let rightWingMatrix = new Matrix4()
        .translate(-0.1, -0.35, 0.3)
        .rotate(-wingAngle, 0, 1, 0)
        .scale(0.7, 0.3, 0.1);
    drawCube(wing_color, rightWingMatrix);
}

function shiftKey(event) {
    if (event.shiftKey) {
        shift = true;
    } else {
        shift = false;
    }
}

window.onload = main;
