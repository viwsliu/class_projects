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
let starting_animation = true;


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
    camera.position.set(-10, 15, 20);
    controls.target.set(10, 10, 10);
    controls.update();
    updater(posX, posY, posZ);
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
            updater(posX, posY, posZ);
            console.log('test')
        }
        document.getElementById('lightPosX').value = this.value;
        updateValues();
    });

    document.getElementById('lightPosY_Slider').addEventListener('mousemove', function (ev) {
        if (ev.buttons == 1) {
            lightPos[1] = (this.value);
            posY = lightPos[1]
            updater(posX, posY, posZ);
        }
        document.getElementById('lightPosY').value = this.value;
        updateValues();
    });

    document.getElementById('lightPosZ_Slider').addEventListener('mousemove', function (ev) {
        if (ev.buttons == 1) {
            lightPos[2] = (this.value);
            posZ = lightPos[2]
            updater(posX, posY, posZ);
        }
        document.getElementById('lightPosZ').value = this.value;
        updateValues();
    });

    // Input field input event listeners
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
        updater(posX, posY, posZ);
    };


    document.getElementById("start").onclick = function () {
        isAnimating = true;
        animateOrbit();
    };
    document.getElementById("stop").onclick = function () {
        isAnimating = false;
        animateOrbit();
    };
    // Initial update
    updateValues();
}



function animateOrbit() {
    if (isAnimating == true) {
        const startPosX = posX;
        const startPosY = posY;
        const startPosZ = posZ;
        const orbitRadius = 50;
        const orbitSpeed = 0.0005;
        
        //orbit origin
        const centerX = 10;
        const centerY = 10;
        const centerZ = 10; 
        

        const angle = orbitSpeed * Date.now();
        const targetPosX = centerX + orbitRadius * Math.cos(angle);
        const targetPosY = centerY;
        const targetPosZ = centerZ + orbitRadius * Math.sin(angle);
        // console.log('run')
        animateSphere(startPosX, startPosY, startPosZ, targetPosX, targetPosY, targetPosZ);
    }
}

function animateSphere(startPosX, startPosY, startPosZ, targetPosX, targetPosY, targetPosZ) {
    const duration = 500; // Animation duration in milliseconds
    
    const start = performance.now();
    function updateSpherePosition() {
        const time = performance.now() - start;
        if (time<duration) {
            const progress = time / duration;
            posX = startPosX + (targetPosX - startPosX) * progress;
            posY = startPosY + (targetPosY - startPosY) * progress;
            posZ = startPosZ + (targetPosZ - startPosZ) * progress;
            updater(posX, posY, posZ);
            requestAnimationFrame(updateSpherePosition);
        } else {
            posX = targetPosX;
            posY = targetPosY;
            posZ = targetPosZ;
            updater(posX, posY, posZ);
            animateOrbit();
        }
        starting_animation = false;
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

function updater(posX, posY, posZ) { //updates pos for 'sun'
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
    scene.add(sphereMesh)

    light_source = new THREE.PointLight(0xFFFFFF, 1, 100); // 0xFFFFFF is white
    light_source.position.set(posX, posY, posZ);
    light_source.intensity = 3;
    scene.add(light_source);
}


function items(){
    function ground(x, y, z) {
        const ground = new THREE.BoxGeometry(100, 0.1, 100);
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
            const geometry = new THREE.SphereGeometry(100, 100, 100);
            
            const skybox = new THREE.Mesh(geometry, material);
            skybox.position.set(10, 40, 10);
            skybox.material.side = THREE.BackSide;
            scene.add(skybox);
        });
        const light_source4 = new THREE.PointLight(0x0000FF, 1, 100); // 0xFFFFFF is white
        // light_source4.position.set(10, 40, 10);
        // light_source4.intensity=10;
        scene.add(light_source4);
    }
    function road(x, y, z) {
        const road = new THREE.BoxGeometry(10, 0.1, 95);
        const road_color = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const roadMesh = new THREE.Mesh(road, road_color);
        roadMesh.position.set(x, y, z);
        scene.add(roadMesh);
        const divider = new THREE.BoxGeometry(0.2, 0.2, 95);
        const divider_color = new THREE.MeshPhongMaterial({ color: 0xFFFF00 }); // Yellow color
        const line1Mesh = new THREE.Mesh(divider, divider_color);
        const line2Mesh = new THREE.Mesh(divider, divider_color);
        line1Mesh.position.set(x-0.2, y, z);
        line2Mesh.position.set(x+0.2, y, z);
        scene.add(line1Mesh, line2Mesh);
    }
    function tree(x, y, z) {
        const trunk = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
        const trunk_color = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const trunkMesh = new THREE.Mesh(trunk, trunk_color);
        trunkMesh.position.set(x, y + 1.5, z); // Adjust y position to center the trunk
        scene.add(trunkMesh);
        const leaves = new THREE.ConeGeometry(2, 4, 32);
        const leaves_color = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        const leavesMesh = new THREE.Mesh(leaves, leaves_color);
        leavesMesh.position.set(x, y + 4, z); // Adjust y position to place leaves on top of the trunk
        scene.add(leavesMesh);
    }
    tree(3,0,20);
    tree(-1,0,10);
    tree(1,0,5);
    tree(2,0,15);
    tree(-7,0,-4);
    tree(-3,0,-2);
    road(10,0,10);
    ground(10,-0.01,10);
    tree(20,0,15);
    tree(19,0,10);
    tree(17,0,-10);
    tree(20,0,-25);
    tree(20,0,-15);
    // sky();
}

function objects(){
    //scooter
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('VR-Mobil/materials.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('VR-Mobil/model.obj', (root) => {
            root.position.set(8, 1.5, 5);
            root.rotation.y += Math.PI / 2;
            scene.add(root);
        });
    });
    //large_building
    const objLoader2 = new OBJLoader();
    const mtlLoader2 = new MTLLoader();
    mtlLoader2.load('large_building/large_buildingE.mtl', (mtl) => {
        mtl.preload();
        objLoader2.setMaterials(mtl);
        objLoader2.load('large_building/large_buildingE.obj', (root) => {
            root.position.set(30, 0, 30);
            root.scale.set(10, 10, 10)
            root.rotation.y += Math.PI / 2;
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

    cubeMesh.position.set(0, 5, -5);
    cylinderMesh.position.set(0, 5, 30);
    cylinderMesh2.position.set(0, 0, 0);

    scene.add(cubeMesh, cylinderMesh, cylinderMesh2);
    const textureLoader = new THREE.TextureLoader(); //texture cube
    const texture = textureLoader.load('./jpg/j.jpg');
    cubeMesh.material.map = texture;
    
    const light_source2 = new THREE.PointLight(0xFF0000, 1, 100); // 0xFFFFFF is white
    light_source2.position.set(0, 5, -5);
    light_source2.intensity=5;
    scene.add(light_source2);

    const light_source3 = new THREE.PointLight(0x0000FF, 1, 100); // 0xFFFFFF is white
    light_source3.position.set(0, 0, 30);
    light_source3.intensity=5;
    scene.add(light_source3);

    function animate() {//animated cube
        cubeMesh.rotation.x += 0.01;
        cubeMesh.rotation.y += 0.01;
        requestAnimationFrame(animate);
    }
    animate();
}

main();
basicShapes();
objects();
items();





