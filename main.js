
import './style.css';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const texture = new THREE.TextureLoader().load('Earth Diffuse.png');
// const material = new THREE.MeshStandardMaterial( { map: texture } );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

cube.position.x = 20;
camera.position.z = 20;

// Instantiate a loader
const loader = new DRACOLoader();

// Specify path to a folder containing WASM/JS decoding libraries.
loader.setDecoderPath( 'https://www.gstatic.com/draco/v1/decoders/' );
// loader.setDecoderPath( '../node_modules/draco3d/' );

// Optional: Pre-fetch Draco WASM/JS module.
loader.preload();

// Load a Draco geometry
loader.load(
	// resource URL
	'Sun Geometry.drc',
	// called when the resource is loaded
	function ( geometry ) {

		// const texture = new THREE.TextureLoader().load('Sun Diffuse.png');
		// const material = new THREE.MeshStandardMaterial( { map: texture } );
    	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const mesh = new THREE.Mesh( geometry, material );
		mesh.scale.set(.01, .01, .01);
		scene.add( mesh );
		const box = new THREE.BoxHelper( mesh, 0xffff00 );
		scene.add( box );
		console.log( geometry.getAttribute("position") );
		console.log( ("great loaded") );
	},
	// called as loading progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

const spaceTexture = new THREE.TextureLoader().load('Sun Diffuse.png');
// scene.background = spaceTexture;



function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
};

animate();