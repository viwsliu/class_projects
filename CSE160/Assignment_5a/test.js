import * as THREE from 'three';
import {OBJLoader} from './lib/OBJLoader.js';
import {MTLLoader} from './lib/MTLLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 90;
	const aspect = 2;
	const near = 0.1;
	const far = 10;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 3;
	camera.position.y = 1;

	const scene = new THREE.Scene();
	{
		const color = 0x00FFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );
	}

	const square = new THREE.BoxGeometry( 1, 1, 1 );
	const circle = new THREE.SphereGeometry(1, 32, 32);
	const cylinder = new THREE.CylinderGeometry(1, 1, 2, 32);

	function makeInstance( geometry, texture, x ) {
		const material = new THREE.MeshBasicMaterial({ map: texture });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.x = x;
		return cube;
	}

	const textureLoader = new THREE.TextureLoader();
	const texture2 = textureLoader.load('/jpg/j.jpg');
	const texture3 = textureLoader.load('/jpg/j3.jpg');
	const texture4 = textureLoader.load('/jpg/j4.jpg');
	makeInstance( square, texture3, - 3 );

	const objLoader = new OBJLoader();
	const mtlLoader = new MTLLoader();
	mtlLoader.load('large_building/large_buildingE.mtl', (mtl) => {
			mtl.preload();
			objLoader.setMaterials(mtl);
			objLoader.load('large_building/large_buildingE.obj', (root) => {
				root.position.set(0, 1, 0);
				scene.add(root);
			});
	});


	const rotating_items = [
		makeInstance( circle, texture2, 0 ),
		makeInstance( cylinder, texture4, 3 ),
	];



	function render( time ) {
		time *= 0.001;
		rotating_items.forEach( ( cube, ndx ) => {
			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;
		} );
		renderer.render( scene, camera );
		requestAnimationFrame( render );
	}
	requestAnimationFrame( render );
}

main();