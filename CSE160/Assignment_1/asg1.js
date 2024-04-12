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

// Global Variables
let canvas;
let gl_ctx;
let attr_Position;
let unif_FragColor;
let unif_Size;
let g_shapesList = []; //shape list

// Global Selection State
let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; // Starting color will be white
let g_selectedSize = 20;
let g_selectedType = "square";
let g_selectedSegments = 10;

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
    document.getElementById("clear").onclick = function () {
        g_shapesList = [];
        renderAllShapes();
    };
    document.getElementById("square_draw").onclick = function () {
        g_selectedType = "square";
    };
    document.getElementById("triangle_draw").onclick = function () {
        g_selectedType = "triangle";
    };
    document.getElementById("circle_draw").onclick = function () {
        g_selectedType = "circle";
    };
    document.getElementById("red_slider").addEventListener("mouseup", function () {
        g_selectedColor[0] = this.value / 100;
    });
    document.getElementById("green_slider").addEventListener("mouseup", function () {
        g_selectedColor[1] = this.value / 100;
    });
    document.getElementById("blue_slider").addEventListener("mouseup", function () {
        g_selectedColor[2] = this.value / 100;
    });
    document.getElementById("size_slider").addEventListener("mouseup", function () {
        g_selectedSize = this.value;
    });
    document.getElementById("segment_slider").addEventListener("mouseup", function () {
        g_selectedSegments = this.value;
    });
}

function click(ev) {
    let x = ev.clientX; 
    let y = ev.clientY;
    let rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - (canvas.width / 2)) / (canvas.width / 2);
    y = ((canvas.height / 2) - (y - rect.top)) / (canvas.height / 2);
    
    let point;
    switch (g_selectedType){
        case "square":
            point = createSquare([x, y], g_selectedColor.slice(), g_selectedSize);
            break;
        case "triangle":
            point = createTriangle([x, y], g_selectedColor.slice(), g_selectedSize);
            break;
        case "circle":
            point = createCircle([x, y], g_selectedColor.slice(), g_selectedSize, g_selectedSegments);
            break;
    }
    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);
    renderAllShapes();
}

function renderAllShapes() {
  gl_ctx.clear(gl_ctx.COLOR_BUFFER_BIT);
  let len = g_shapesList.length;
  for (let i = 0; i < len; i++) {
      g_shapesList[i].render();
  }
}

function createSquare(position, color, size) {
    return {
        type: "square",
        position: position,
        color: color,
        size: size,
        render: function() {
            gl_ctx.disableVertexAttribArray(attr_Position);
            gl_ctx.vertexAttrib2fv(attr_Position, new Float32Array(this.position));
            gl_ctx.uniform4fv(unif_FragColor, new Float32Array(this.color));
            gl_ctx.uniform1f(unif_Size, this.size);
            gl_ctx.drawArrays(gl_ctx.POINTS, 0, 1);
        }
    };
}

function createCircle(position, color, size, segments) {
    return {
        type: "circle",
        position: position,
        color: color,
        size: size,
        segments: segments,
        render: function() {
            let size = this.size;
            gl_ctx.uniform4fv(unif_FragColor, new Float32Array(this.color));
            let d = this.size / 200.0;
            let angleStep = 360 / this.segments;
            for (let angle = 0; angle < 360; angle = angle + angleStep) {
                let centerPt = [this.position[0], this.position[1]];
                let angle1 = angle;
                let angle2 = angle + angleStep;
                let vec1 = [Math.cos(angle1 * Math.PI / 180) * d, Math.sin(angle1 * Math.PI / 180) * d];
                let vec2 = [Math.cos(angle2 * Math.PI / 180) * d, Math.sin(angle2 * Math.PI / 180) * d];
                let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
                let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
                drawTriangle(centerPt, pt1, pt2);
            }
        }
    };
}

function createTriangle(position, color, size) {
    return {
        type: "triangle",
        position: position,
        color: color,
        size: size,
        render: function() {
            let p1 = this.position;
            let p2 = [p1[0] + (this.size/200), p1[1]];
            let p3 = [p1[0], p1[1] + (this.size/200)];
            let size = this.size;
            gl_ctx.uniform4fv(unif_FragColor, new Float32Array(this.color));
            gl_ctx.uniform1f(unif_Size, size);
            drawTriangle(p1, p2, p3);
        }
    };
}

function drawTriangle(p1, p2, p3){
    let vertexBuffer = gl_ctx.createBuffer();
    gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, vertexBuffer);
    gl_ctx.bufferData(gl_ctx.ARRAY_BUFFER, new Float32Array(p1.concat(p2).concat(p3)), gl_ctx.DYNAMIC_DRAW);
    gl_ctx.vertexAttribPointer(attr_Position, 2, gl_ctx.FLOAT, false, 0, 0);
    gl_ctx.enableVertexAttribArray(attr_Position);
    gl_ctx.drawArrays(gl_ctx.TRIANGLES, 0, 3);
  }