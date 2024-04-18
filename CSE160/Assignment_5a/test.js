import * as THREE from 'three';
import { OrbitControls } from './lib/OrbitControls.js';
import { OBJLoader } from './lib/OBJLoader.js';
import { MTLLoader } from './lib/MTLLoader.js';





function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 5, 10);

    const scene = new THREE.Scene();

    // 1. Three Different Primary Shapes
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);

    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });

    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    cubeMesh.position.set(-5, 0, 0);
    sphereMesh.position.set(0, 0, 0);
    cylinderMesh.position.set(5, 0, 0);

    scene.add(cubeMesh, sphereMesh, cylinderMesh);

    // 2. Animated Shape
    function animate() {
        cubeMesh.rotation.x += 0.01;
        cubeMesh.rotation.y += 0.01;
        requestAnimationFrame(animate);
    }
    animate();

    // 3. Directional Light Source
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // 4. Textured Shape
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('j.jpg');
    cubeMesh.material.map = texture;

    // 5. Custom Textured 3D Model
    const objLoader = new OBJLoader();
    objLoader.load('VR-Mobil/model.obj', (root) => {
		root.position.set(5, 0, 5);
        scene.add(root);
    });

    const mtlLoader = new MTLLoader();
    mtlLoader.load('VR-Mobil/materials.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('VR-Mobil/model.obj', (root) => {
			root.position.set(5, 0, 5);
			scene.add(root);
        });
    });

    // 6. Camera Movement with Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // 7. Three Different Light Sources
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 8. Skybox
    const loader = new THREE.CubeTextureLoader();
    const textureCube = loader.load([
        'j.jpg',
        'j2.jpg',
        'j3.jpg',
        'j4.jpg',
        'j5.jpg',
        'j6.jpg'
    ]);
    scene.background = textureCube;



	function createRoad(x, y, z) {
		const roadWidth = 6;
		const roadLength = 20;
		const roadHeight = 0.1;
		const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
		const roadGeometry = new THREE.BoxGeometry(roadWidth, roadHeight, roadLength);
		const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
		roadMesh.position.set(x, y, z);
		scene.add(roadMesh);
		const lineGeometry = new THREE.BoxGeometry(0.2, roadHeight, 2);
		const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 }); // Yellow color
		const line1Mesh = new THREE.Mesh(lineGeometry, lineMaterial);
		const line2Mesh = new THREE.Mesh(lineGeometry, lineMaterial);
		line1Mesh.position.set(x, y, z-3);
		line2Mesh.position.set(x, y, z+3);
		scene.add(line1Mesh, line2Mesh);
	}
	
	function createTree(x, y, z) {
		const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
		const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
		const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
		trunkMesh.position.set(x, y + 1.5, z); // Adjust y position to center the trunk
		scene.add(trunkMesh);
	
		const leavesGeometry = new THREE.ConeGeometry(2, 4, 32);
		const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
		const leavesMesh = new THREE.Mesh(leavesGeometry, leavesMaterial);
		leavesMesh.position.set(x, y + 4, z); // Adjust y position to place leaves on top of the trunk
		scene.add(leavesMesh);
	}

	createTree(5,0,5);
	createTree(-3,0,2);
	createTree(0,0,-5);
	createTree(8,0,-3);
	createTree(-7,0,-4);
	createTree(4,0,-2);
	createTree(-6,0,6);
	createTree(2,0,8);
	createTree(-9,0,0);
	createTree(1,0,4);
	createRoad(10,0,10)

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
}



main();
