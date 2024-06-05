import * as THREE from 'three';
import {OrbitControls} from './lib/OrbitControls.js';
import {OBJLoader} from './lib/OBJLoader.js';
import {MTLLoader} from './lib/MTLLoader.js';

//global vars
let posX = 10;
let posY = 10;
let posZ = 10;
let lightPos = [10,10,10];
let sphereMesh, light_source;
const scene = new THREE.Scene();
let isAnimating = false;
let isAnimatingMotorcycle = false;

function main() {
    setup_UI_elements();
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(-30, 20, -20);
    controls.target.set(10, 10, 15); //redo this to 10,10,10
    controls.update();
    SphereUpdater(posX, posY, posZ);
    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
}

function setup_UI_elements() {
    function updateValues() {
        lightPos[0] = parseFloat(document.getElementById('lightPosX').value);
        lightPos[1] = parseFloat(document.getElementById('lightPosY').value);
        lightPos[2] = parseFloat(document.getElementById('lightPosZ').value);
        document.getElementById('lightPosX_Slider').value = lightPos[0];
        document.getElementById('lightPosY_Slider').value = lightPos[1];
        document.getElementById('lightPosZ_Slider').value = lightPos[2];
    }

    document.getElementById('lightPosX_Slider').addEventListener('mousemove', function (ev) {
        if (ev.buttons == 1) {
            lightPos[0] = (this.value);
            posX = lightPos[0]
            SphereUpdater(posX, posY, posZ);
        }
        document.getElementById('lightPosX').value = this.value;
        updateValues();
    });

    document.getElementById('lightPosY_Slider').addEventListener('mousemove', function (ev) {
        if (ev.buttons == 1) {
            lightPos[1] = (this.value);
            posY = lightPos[1]
            SphereUpdater(posX, posY, posZ);
        }
        document.getElementById('lightPosY').value = this.value;
        updateValues();
    });

    document.getElementById('lightPosZ_Slider').addEventListener('mousemove', function (ev) {
        if (ev.buttons == 1) {
            lightPos[2] = (this.value);
            posZ = lightPos[2]
            SphereUpdater(posX, posY, posZ);
        }
        document.getElementById('lightPosZ').value = this.value;
        updateValues();
    });

    document.getElementById('lightPosX').addEventListener('input', function () {
        lightPos[0] = (this.value);
        posX = lightPos[0]
        document.getElementById('lightPosX_Slider').value = this.value;
        updateValues();
    });

    document.getElementById('lightPosY').addEventListener('input', function () {
        lightPos[1] = (this.value);
        posY = lightPos[1]
        document.getElementById('lightPosY_Slider').value = this.value;
        updateValues();
    });

    document.getElementById('lightPosZ').addEventListener('input', function () {
        lightPos[2] = (this.value);
        posZ = lightPos[2]
        document.getElementById('lightPosZ_Slider').value = this.value;
        updateValues();
    });
    document.getElementById("confirm").onclick = function () {
        SphereUpdater(posX, posY, posZ);
    };


    document.getElementById("start").onclick = function () {
        isAnimating = true;
        animateOrbit();
    };
    document.getElementById("stop").onclick = function () {
        isAnimating = false;
        animateOrbit();
    };
    document.getElementById("start_motorcycle").onclick = function () {
        isAnimatingMotorcycle = true;
        animateMotorcycle();
    };
    document.getElementById("stop_motorcycle").onclick = function () {
        isAnimatingMotorcycle = false;
        animateMotorcycle();
    };
    updateValues();   
    
}

function animateOrbit() {
    if (isAnimating == true) {
        const startPosX = posX;
        const startPosY = posY;
        const startPosZ = posZ;
        const orbitRadius = 50;
        const orbitSpeed = 0.0005;
        const centerX = 10;
        const centerY = 10;
        const centerZ = 10; 
        
        const angle = orbitSpeed * Date.now();
        const targetPosX = centerX + orbitRadius * Math.cos(angle);
        const targetPosY = centerY;
        const targetPosZ = centerZ + orbitRadius * Math.sin(angle);
        animateSphere(startPosX, startPosY, startPosZ, targetPosX, targetPosY, targetPosZ);
        
    }
}

function animateSphere(startPosX, startPosY, startPosZ, targetPosX, targetPosY, targetPosZ) {
    const duration = 500;
    const start = performance.now();
    function updateSpherePosition() {
        const time = performance.now() - start;
        if (time<duration) {
            const progress = time / duration;
            posX = startPosX + (targetPosX - startPosX) * progress;
            posY = startPosY + (targetPosY - startPosY) * progress;
            posZ = startPosZ + (targetPosZ - startPosZ) * progress;
            SphereUpdater(posX, posY, posZ);
            requestAnimationFrame(updateSpherePosition);
            // console.log(time, duration)
        } else {
            console.log('bruh')
            posX = targetPosX;
            posY = targetPosY;
            posZ = targetPosZ;
            SphereUpdater(posX, posY, posZ);
            animateOrbit();
            
        }
        // console.log('run');
        document.getElementById('lightPosX').value = posX;
        document.getElementById('lightPosY').value = posY;
        document.getElementById('lightPosZ').value = posZ;
        document.getElementById('lightPosX_Slider').value = posX;
        document.getElementById('lightPosY_Slider').value = posY;
        document.getElementById('lightPosZ_Slider').value = posZ;
    }
    requestAnimationFrame(updateSpherePosition);
}

function SphereUpdater(posX, posY, posZ) { //updates pos for 'sun'
    if (sphereMesh) {
        scene.remove(sphereMesh);
        sphereMesh.geometry.dispose();
        sphereMesh.material.dispose();
    }
    if (light_source) {
        scene.remove(light_source);
        light_source.dispose();
    }
    const sphere = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    sphereMesh.position.set(posX, posY, posZ);
    scene.add(sphereMesh);

    light_source = new THREE.PointLight(0xFFFFFF, 1, 100); // 0xFFFFFF white
    light_source.position.set(posX, posY, posZ);
    light_source.intensity = 3;
    scene.add(light_source);
}

function generate_world(){
    function ground(x, y, z) {
        const ground = new THREE.BoxGeometry(300, 0.1, 300);
        const ground_color = new THREE.MeshBasicMaterial({ color: 0x734A12 });
        const groundMesh = new THREE.Mesh(ground, ground_color);
        groundMesh.position.set(x, y, z);
        scene.add(groundMesh);
    }
    function sky() {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('./jpg/sky2.jpg', function(texture) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = texture.image.height;
            canvas.height = texture.image.width;
            context.translate(canvas.width / 2, canvas.height / 2);
            context.drawImage(texture.image, -canvas.height / 2, -canvas.width / 2);
            const texture2 = new THREE.CanvasTexture(canvas);
            const material = new THREE.MeshBasicMaterial({ map: texture2 });
            const geometry = new THREE.SphereGeometry(200, 200, 200);
            
            const skybox = new THREE.Mesh(geometry, material);
            skybox.position.set(10, 150, 10);
            skybox.material.side = THREE.BackSide;
            scene.add(skybox);
        });
        const light_source4 = new THREE.PointLight(0x0000FF, 1, 100);
        // light_source4.position.set(10, 40, 10);
        // light_source4.intensity=10;
        scene.add(light_source4);
    }
    function road(x, y, z) {
        const road = new THREE.BoxGeometry(10, 0.1, 100);
        const road_color = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const roadMesh = new THREE.Mesh(road, road_color);
        roadMesh.position.set(x, y, z);
        scene.add(roadMesh);

        const sidewalk1 = new THREE.BoxGeometry(3, 0.2, 100);
        const sidewalk1_color = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const sidewalk1Mesh = new THREE.Mesh(sidewalk1, sidewalk1_color);
        sidewalk1Mesh.position.set(x+5, y, z);
        scene.add(sidewalk1Mesh);

        const sidewalk2 = new THREE.BoxGeometry(3, 0.2, 100);
        const sidewalk2_color = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const sidewalk2Mesh = new THREE.Mesh(sidewalk2, sidewalk2_color);
        sidewalk2Mesh.position.set(x-5, y, z);
        scene.add(sidewalk2Mesh);

        const divider = new THREE.BoxGeometry(0.2, 0.2, 100);
        const divider_color = new THREE.MeshPhongMaterial({ color: 0xFFFF00 }); // Yellow color
        const line1Mesh = new THREE.Mesh(divider, divider_color);
        const line2Mesh = new THREE.Mesh(divider, divider_color);
        line1Mesh.position.set(x-0.2, y, z);
        line2Mesh.position.set(x+0.2, y, z);
        scene.add(line1Mesh, line2Mesh);
    }

    function rotated_road(x, y, z) {
        const road = new THREE.BoxGeometry(100, 0.1, 10);
        const road_color = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const roadMesh = new THREE.Mesh(road, road_color);
        roadMesh.position.set(x, y, z);
        scene.add(roadMesh);

        const sidewalk1 = new THREE.BoxGeometry(100, 0.2, 3);
        const sidewalk1_color = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const sidewalk1Mesh = new THREE.Mesh(sidewalk1, sidewalk1_color);
        sidewalk1Mesh.position.set(x, y, z+5);
        scene.add(sidewalk1Mesh);

        const sidewalk2 = new THREE.BoxGeometry(100, 0.2, 3);
        const sidewalk2_color = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const sidewalk2Mesh = new THREE.Mesh(sidewalk2, sidewalk2_color);
        sidewalk2Mesh.position.set(x, y, z-5);
        scene.add(sidewalk2Mesh);

        const divider = new THREE.BoxGeometry(100, 0.2, 0.2);
        const divider_color = new THREE.MeshPhongMaterial({ color: 0xFFFF00 }); // Yellow color
        const line1Mesh = new THREE.Mesh(divider, divider_color);
        const line2Mesh = new THREE.Mesh(divider, divider_color);
        line1Mesh.position.set(x, y, z+0.2);
        line2Mesh.position.set(x, y, z-0.2);
        scene.add(line1Mesh, line2Mesh);
    }

    function createTrafficLight(x, y, z, group) {
        const lightPole = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
        const poleMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });
        const poleMesh = new THREE.Mesh(lightPole, poleMaterial);
        poleMesh.position.set(x, y+2, z);

        const lightBox = new THREE.BoxGeometry(0.8, 3, 0.8);
        const lightBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const lightBoxMesh = new THREE.Mesh(lightBox, lightBoxMaterial);
        lightBoxMesh.position.set(0, -4, -5);

        const lightGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const redLightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const yellowLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const greenLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        const redLightMesh = new THREE.Mesh(lightGeometry, redLightMaterial);
        const yellowLightMesh = new THREE.Mesh(lightGeometry, yellowLightMaterial);
        const greenLightMesh = new THREE.Mesh(lightGeometry, greenLightMaterial);
        switch(group) {
            case 0:
                redLightMesh.position.set(0, -3, -5.6);
                yellowLightMesh.position.set(0, -4, -5.6);
                greenLightMesh.position.set(0, -5, -5.6);
                break;
            case 1:
                redLightMesh.position.set(10.5, -3, -15);
                yellowLightMesh.position.set(10.5, -4, -15);
                greenLightMesh.position.set(10.5, -5, -15);
            break;
            case 2:
                redLightMesh.position.set(0, -3, 5.6);
                yellowLightMesh.position.set(0, -4, 5.6);
                greenLightMesh.position.set(0, -5, 5.6);
            break;
            case 3:
                redLightMesh.position.set(-10.5, -3, -5);
                yellowLightMesh.position.set(-10.5, -4, -5);
                greenLightMesh.position.set(-10.5, -5, -5);
            break;
        }

        const lightGroup = new THREE.Group();
        lightGroup.add(lightBoxMesh);
        lightGroup.add(redLightMesh);
        lightGroup.add(yellowLightMesh);
        lightGroup.add(greenLightMesh);
        lightGroup.position.set(x, y + 9.5, z + 5);

        const poleGroup = new THREE.Group();
        poleGroup.add(poleMesh);
        poleGroup.add(lightGroup);
        scene.add(poleGroup);
    }
    
    function intersection(x, y, z) {
        const roadIntersect = new THREE.BoxGeometry(10, 0.1, 10);
        const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 });
        const roadMesh = new THREE.Mesh(roadIntersect, roadMaterial);
        roadMesh.position.set(x, y, z);
        scene.add(roadMesh);
    
        const poleDistance = 5;
        createTrafficLight(x - poleDistance, y, z - poleDistance, 0);
        createTrafficLight(x - poleDistance, y, z + poleDistance, 1);
        createTrafficLight(x + poleDistance, y, z - poleDistance, 2);
        createTrafficLight(x + poleDistance, y, z + poleDistance, 3);
    }
    
    function tree(x, y, z) {
        const trunk = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
        const trunk_color = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const trunkMesh = new THREE.Mesh(trunk, trunk_color);
        trunkMesh.position.set(x, y + 1.5, z);
        scene.add(trunkMesh);
        const leaves = new THREE.ConeGeometry(2, 4, 32);
        const leaves_color = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        const leavesMesh = new THREE.Mesh(leaves, leaves_color);
        leavesMesh.position.set(x, y + 4, z);
        scene.add(leavesMesh);
    }
    tree(3,0,20);
    tree(-1,0,10);
    tree(1,0,5);
    tree(2,0,15);
    tree(-7,0,-4);
    tree(-3,0,-2);

    tree(-10,0,15);
    tree(-11,0,10);
    tree(-13,0,-10);
    tree(-10,0,-25);
    tree(-10,0,-15);

    tree(-15, 0, 25);
    tree(-28, 0, 5);
    tree(-13, 0, 10);
    tree(-22, 0, -8);
    tree(-10, 0, -12);
    tree(-8, 0, 18);

    tree(-16, 0, 30);
    tree(-25, 0, -10);
    tree(-12, 0, -5);
    tree(-26, 0, 20);
    tree(-17, 0, -15);
    tree(-11, 0, 15);

    tree(-32, 0, -20);
    tree(-35, 0, -25);
    tree(-9, 0, 22);
    tree(-24, 0, 8);
    tree(-6, 0, -18);
    tree(-14, 0, -7);

    tree(-23, 0, 17);
    tree(-18, 0, 12);
    tree(-29, 0, -13);
    tree(-20, 0, 0);
    tree(-34, 0, 5);
    tree(-7, 0, -9);

    tree(-35, 0, 35);
    tree(-48, 0, 15);
    tree(-33, 0, 20);
    tree(-42, 0, 2);
    tree(-30, 0, -2);
    tree(-28, 0, 28);

    tree(-36, 0, 40);
    tree(-45, 0, 0);
    tree(-32, 0, 5);
    tree(-46, 0, 30);
    tree(-37, 0, -5);
    tree(-31, 0, 25);

    tree(-52, 0, -10);
    tree(-55, 0, -15);
    tree(-29, 0, 32);
    tree(-44, 0, 18);
    tree(-26, 0, -8);
    tree(-34, 0, 3);

    tree(-43, 0, 27);
    tree(-38, 0, 22);
    tree(-49, 0, -3);
    tree(-40, 0, 10);
    tree(-54, 0, 15);
    tree(-27, 0, 1);

    road(10,0,-100);
    road(10,0,0);
    road(10,0,110);
    rotated_road(65,0,55);
    rotated_road(-45,0,55);
    intersection(10, 0, 55);
    ground(10,-0.01,10);
    sky();
}

function objects(x,y,z){
    const objLoader1 = new OBJLoader();
    const mtlLoader1 = new MTLLoader();
    mtlLoader1.load('large_building/large_buildingE.mtl', (mtl) => {
        mtl.preload();
        objLoader1.setMaterials(mtl);
        objLoader1.load('large_building/large_buildingE.obj', (root) => {
            root.position.set(x,y,z);
            root.scale.set(10, 10, 10)
            root.rotation.y += Math.PI / 2;
            scene.add(root);
        });
    });

    const objLoader2 = new OBJLoader();
    const mtlLoader2 = new MTLLoader();
    mtlLoader2.load('large_building/large_buildingE.mtl', (mtl) => {
        mtl.preload();
        objLoader2.setMaterials(mtl);
        objLoader2.load('large_building/large_buildingE.obj', (root) => {
            root.position.set(x,y,z-12);
            root.scale.set(10, 10, 10)
            root.rotation.y += Math.PI / 2;
            scene.add(root);
        });
    });

    const objLoader3 = new OBJLoader();
    const mtlLoader3 = new MTLLoader();
    mtlLoader3.load('large_building/large_buildingE.mtl', (mtl) => {
        mtl.preload();
        objLoader3.setMaterials(mtl);
        objLoader3.load('large_building/large_buildingE.obj', (root) => {
            root.position.set(x,y,z-24);
            root.scale.set(10, 10, 10)
            root.rotation.y += Math.PI / 2;
            scene.add(root);
        });
    });
}

function objects2(x,y,z){
    const objLoader1 = new OBJLoader();
    const mtlLoader1 = new MTLLoader();
    mtlLoader1.load('large_building/large_buildingE.mtl', (mtl) => {
        mtl.preload();
        objLoader1.setMaterials(mtl);
        objLoader1.load('large_building/large_buildingE.obj', (root) => {
            root.position.set(x,y,z);
            root.scale.set(10, 10, 10)
            scene.add(root);
        });
    });

    const objLoader2 = new OBJLoader();
    const mtlLoader2 = new MTLLoader();
    mtlLoader2.load('large_building/large_buildingE.mtl', (mtl) => {
        mtl.preload();
        objLoader2.setMaterials(mtl);
        objLoader2.load('large_building/large_buildingE.obj', (root) => {
            root.position.set(x-12,y,z);
            root.scale.set(10, 10, 10);
            scene.add(root);
        });
    });

    const objLoader3 = new OBJLoader();
    const mtlLoader3 = new MTLLoader();
    mtlLoader3.load('large_building/large_buildingE.mtl', (mtl) => {
        mtl.preload();
        objLoader3.setMaterials(mtl);
        objLoader3.load('large_building/large_buildingE.obj', (root) => {
            root.position.set(x-24,y,z);
            root.scale.set(10, 10, 10);
            scene.add(root);
        });
    });
}

function basicShapes(){
    const cube = new THREE.BoxGeometry(5, 5, 5);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const cubeMesh = new THREE.Mesh(cube, cubeMaterial);

    const cylinder = new THREE.CylinderGeometry(1, 1, 2, 32);
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });
    const cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);

    const cylinder2 = new THREE.CylinderGeometry(1, 1, 30, 32);
    const cylinderMaterial2 = new THREE.MeshPhongMaterial({ color: 0x00FFFF });
    const cylinderMesh2 = new THREE.Mesh(cylinder2, cylinderMaterial2);

    cubeMesh.position.set(-5, 5, 35);
    cylinderMesh.position.set(-50, 0, 30);
    cylinderMesh2.position.set(-10, 10, -50);

    scene.add(cubeMesh, cylinderMesh, cylinderMesh2);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./jpg/j.jpg');
    cubeMesh.material.map = texture;
    
    const light_source2 = new THREE.PointLight(0xFF0000, 1, 100);
    light_source2.position.set(-5, 5, 35);
    light_source2.intensity=5;
    scene.add(light_source2);

    const light_source3 = new THREE.AmbientLight(0x0000FF, 1, 100);
    light_source3.position.set(-50, 0, 30);
    light_source3.intensity=1;
    scene.add(light_source3);

    const light_source4 = new THREE.AmbientLight(0x0000FF, 1, 100);
    light_source4.position.set(-10, 10, -50);
    light_source4.intensity=1;
    scene.add(light_source4);


    function animate() {//animated cube
        cubeMesh.rotation.x += 0.01;
        cubeMesh.rotation.y += 0.01;
        requestAnimationFrame(animate);
    }
    animate();
}

let root;
let motor_light_source;
let motor_light_shape;
function createMotorcycle() {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    mtlLoader.load('VR-Mobil/materials.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('VR-Mobil/model.obj', (object) => {
            root = object;
            root.position.set(8, 1.5, 5);
            root.rotation.y += Math.PI / 2;
            scene.add(root);
            if (isAnimatingMotorcycle==true) {
                animateMotorcycle();
                isAnimatingMotorcycle = false;
            }
        });
    });
    motor_light_source = new THREE.SpotLight(0xFFFFFF, 0.2);
    motor_light_source.position.set(8, 3, 8);
    motor_light_source.intensity = 5;
    var targetObject = new THREE.Object3D();
    targetObject.position.set(10, 5, 100);
    scene.add(targetObject);
    motor_light_source.target = targetObject;
    scene.add(motor_light_source);


    const cylinder = new THREE.CylinderGeometry(5, 0.5, 5, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFF00, 
        transparent: true, 
        opacity: 0.5
    });
    motor_light_shape = new THREE.Mesh(cylinder, cylinderMaterial);
    motor_light_shape.position.set(8, 3, 9);
    motor_light_shape.rotation.z = Math.PI / 2;
    motor_light_shape.rotation.y = Math.PI / 2;
    scene.add(motor_light_shape);
    
    
}

function animateMotorcycle() {
    if(isAnimatingMotorcycle==true){
    requestAnimationFrame(animateMotorcycle);
    if (root) {
        root.position.z += 0.5;
        if (root.position.z > 100){
            root.position.z = -100;
        }
    }
    if (motor_light_source) {
        motor_light_source.position.z +=0.5;
        if (motor_light_source.position.z > 100){
            motor_light_source.position.z = -100;
        }
    }
    if (motor_light_shape) {
        motor_light_shape.position.z +=0.5;
        if (motor_light_shape.position.z > 100){
            motor_light_shape.position.z = -100;
        }
    }
}
}

main();
basicShapes();
objects(22.5,0,92);
objects(22.5,0,42);
objects(22.5,0,0);
objects2(-3,0,67);
objects2(-50,0,67);
generate_world();
createMotorcycle();