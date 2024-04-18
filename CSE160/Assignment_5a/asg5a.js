import * as THREE from 'three';
import {OrbitControls} from './lib/OrbitControls.js';
import {OBJLoader} from './lib/OBJLoader.js';
import {MTLLoader} from './lib/MTLLoader.js';
import {GUI} from './lib/lil-gui.module.min.js';
function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 90;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 5;

	const scene = new THREE.Scene();
	{
		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );
	}

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	function makeInstance( geometry, texture, x ) {
		const material = new THREE.MeshBasicMaterial({ map: texture });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.x = x;
		return cube;
	}
	
	const textureLoader = new THREE.TextureLoader();
	const texture2 = textureLoader.load('j.jpg');
	const texture3 = textureLoader.load('j3.jpg');
	const texture4 = textureLoader.load('j4.jpg');

	const cubes = [
		makeInstance( geometry, texture2, 0 ),
		makeInstance( geometry, texture3, - 2 ),
		makeInstance( geometry, texture4, 2 ),
	];

	function render( time ) {
		time *= 0.001;
		cubes.forEach( ( cube, ndx ) => {
			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;
		} );
		renderer.render( scene, camera );
		requestAnimationFrame( render );
	}
	requestAnimationFrame( render );

	const objLoader = new OBJLoader();
	objLoader.load('VR-Mobil/model.obj', (root) => {
	  scene.add(root);
	});

	const mtlLoader = new MTLLoader();
	mtlLoader.load('VR-Mobil/materials.mtl', (mtl) => {
	  mtl.preload();
	  objLoader.setMaterials(mtl);
	  objLoader.load('VR-Mobil/model.obj', (root) => {
		scene.add(root);
	  });
	});
}

main();