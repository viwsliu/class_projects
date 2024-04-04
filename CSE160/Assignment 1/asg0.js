function main() {
  canvas = document.getElementById('asg0');
  board = canvas.getContext('2d');
  board.fillStyle = 'black';
  board.fillRect(0, 0, 400, 400);
}

function drawVector(v, color) {
  board.beginPath();
  board.moveTo(200, 200);
  board.lineTo(200+v.elements[0]*20, 200-v.elements[1]*20, 20*v.elements[2]);
  board.strokeStyle = color;
  board.stroke();
}

function handleDrawEvent() {
  // clear the canvas and set bg color to black
  board.clearRect(0, 0, 400, 400);
  board.fillStyle = 'black';
  board.fillRect(0, 0, 400, 400);
  // read the values of the text boxes to create v1 and v2.
  let v1_x = document.getElementById('v1_x').value;
  let v1_y = document.getElementById('v1_y').value;
  let v2_x = document.getElementById('v2_x').value;
  let v2_y = document.getElementById('v2_y').value;
  let v1 = new Vector3([v1_x, v1_y, 0.0]);
  let v2 = new Vector3([v2_x, v2_y, 0.0]);
  // Call drawVector(v1, "red") and drawVector(v2, "blue")
  drawVector(v1, "red");
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
  let v1_x = document.getElementById('v1_x').value;
  let v1_y = document.getElementById('v1_y').value;
  let v2_x = document.getElementById('v2_x').value;
  let v2_y = document.getElementById('v2_y').value;
  board.clearRect(0, 0, 400, 400);
  board.fillStyle = 'black';
  board.fillRect(0, 0, 400, 400);
  let v1 = new Vector3([v1_x, v1_y, 0.0]);
  let v2 = new Vector3([v2_x, v2_y, 0.0]);
  // Call drawVector(v1, "red") and drawVector(v2, "blue")
  drawVector(v1, "red");
  drawVector(v2, "blue");
  let operation_val = document.getElementById('operation').value;
  let scalarVal = document.getElementById('scalar').value;
  switch (operation_val) {
    case "add":
        drawVector(v1.add(v2),"green");
        break;
    case "subtract":
        drawVector(v1.sub(v2), "green");
        break;
    case "multiply":
        drawVector(v1.mul(scalarVal), "green");
        drawVector(v2.mul(scalarVal), "green");
        break;
    case "divide":
        drawVector(v1.div(scalarVal), "green");
        drawVector(v2.div(scalarVal), "green");
        break;
    case "magnitude":
        console.log("Magnitude of v1: ", v1.magnitude());
        console.log("Magnitude of v2: ", v2.magnitude());
        break;
    case "norm":
        drawVector(v1.normalize(), "green");
        drawVector(v2.normalize(), "green");
        break;
    case "angle":
        console.log("Angle: ", (angleBetween(v1, v2)));
        break;
    case "area":
        console.log("Area of Triangle: ", (areaTriangle(v1, v2)));
        break;
  }
}

function angleBetween(v1, v2) {
  var alpha = Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude()));
  alpha *= 180 / Math.PI;
  return alpha;
}

function areaTriangle(v1, v2) {
  var area = Vector3.cross(v1, v2);
  var new_vector = new Vector3([area[0], area[1], area[2]]);
  return new_vector.magnitude() / 2;
}