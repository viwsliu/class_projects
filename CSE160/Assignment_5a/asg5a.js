import * as THREE from 'three';
import {OrbitControls} from './lib/OrbitControls.js';
import {OBJLoader} from './lib/OBJLoader.js';
import {MTLLoader} from './lib/MTLLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(1700, 900);

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(-10, 15, 20);
    controls.target.set(10, 10, 10);
    controls.update();
    const scene = new THREE.Scene();

    //primary shapes, color, mesh
    const cube = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const cubeMesh = new THREE.Mesh(cube, cubeMaterial);

    const sphere = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);

    const cylinder = new THREE.CylinderGeometry(1, 1, 2, 32);
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });
    const cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);

    const cylinder2 = new THREE.CylinderGeometry(1, 1, 30, 32);
    const cylinderMaterial2 = new THREE.MeshPhongMaterial({ color: 0x00FFFF });
    const cylinderMesh2 = new THREE.Mesh(cylinder2, cylinderMaterial2);


    cubeMesh.position.set(0, 5, -5);
    sphereMesh.position.set(10, 10, 10);
    cylinderMesh.position.set(0, 5, 30);
    cylinderMesh2.position.set(0, 0, 0);

    scene.add(cubeMesh, sphereMesh, cylinderMesh, cylinderMesh2);

    const textureLoader = new THREE.TextureLoader(); //texture cube
    const texture = textureLoader.load('./jpg/j.jpg');
    cubeMesh.material.map = texture;
    
    // light sources
    const light_source = new THREE.PointLight(0xFFFFFF, 1, 100); // 0xFFFFFF is white
    light_source.position.set(10, 10, 10);
    scene.add(light_source);

    const light_source2 = new THREE.PointLight(0xFF0000, 1, 100); // 0xFFFFFF is white
    light_source2.position.set(0, 5, -5);
    scene.add(light_source2);

    const light_source3 = new THREE.PointLight(0x0000FF, 1, 100); // 0xFFFFFF is white
    light_source3.position.set(0, 0, 30);
    scene.add(light_source3);

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

    function create_dirt(x, y, z) {
        const dirtMaterial = new THREE.MeshBasicMaterial({ color: 0x734A12 });
        const groundGeometry = new THREE.BoxGeometry(100, 0.1, 100);
        const groundMesh = new THREE.Mesh(groundGeometry, dirtMaterial);
        groundMesh.position.set(x, y, z);
        scene.add(groundMesh);
    }
    
	function createRoad(x, y, z) {
		const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
		const roadGeometry = new THREE.BoxGeometry(10, 0.1, 95);
		const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
		roadMesh.position.set(x, y, z);
		scene.add(roadMesh);
		const lineGeometry = new THREE.BoxGeometry(0.2, 0.2, 95);
		const lineMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFF00 }); // Yellow color
		const line1Mesh = new THREE.Mesh(lineGeometry, lineMaterial);
		const line2Mesh = new THREE.Mesh(lineGeometry, lineMaterial);
		line1Mesh.position.set(x-0.2, y, z);
		line2Mesh.position.set(x+0.2, y, z);
		scene.add(line1Mesh, line2Mesh);
	}
	
	function createTree(x, y, z) {
		const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
		const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
		const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
		trunkMesh.position.set(x, y + 1.5, z); // Adjust y position to center the trunk
		scene.add(trunkMesh);
	
		const leavesGeometry = new THREE.ConeGeometry(2, 4, 32);
		const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
		const leavesMesh = new THREE.Mesh(leavesGeometry, leavesMaterial);
		leavesMesh.position.set(x, y + 4, z); // Adjust y position to place leaves on top of the trunk
		scene.add(leavesMesh);
	}

	createTree(3,0,20);
	createTree(-1,0,10);
	createTree(1,0,5);
	createTree(2,0,15);
	createTree(-7,0,-4);
	createTree(-3,0,-2);
    createRoad(10,0,10);
    create_dirt(10,-0.01,10);
	createTree(20,0,15);
	createTree(19,0,10);
	createTree(17,0,-10);
    createTree(20,0,-25);
    createTree(20,0,-15);

    function animate() {//animated cube
        cubeMesh.rotation.x += 0.01;
        cubeMesh.rotation.y += 0.01;
        requestAnimationFrame(animate);
    }
    animate();

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
}
main();
