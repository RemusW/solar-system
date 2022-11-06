
import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import CBody from './cbody';
import * as dat from 'dat.gui';

class Body {
	mesh;
	system;
}


const TIME_STEP = 1/60;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const pointlight = new THREE.PointLight(0xffffff);
scene.add(pointlight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.z = 200;
camera.position.x = 200;

const controls = new OrbitControls( camera, renderer.domElement );

// Instantiate a loader
const loader = new DRACOLoader();
// Specify path to a folder containing WASM/JS decoding libraries.
loader.setDecoderPath( 'https://www.gstatic.com/draco/v1/decoders/' );


let sun = new Body();
sun.system = new THREE.Group();
let earth = new Body();
earth.system = new THREE.Group();
let moon = new Body();
moon.system = new THREE.Group();


let solarSystem = new THREE.Group();
// Load a Draco geometry
loader.load(
	// resource URL
	'Sun Geometry.drc',
	// called when the resource is loaded
	function ( geometry ) {
		const texture = new THREE.TextureLoader().load('Sun Diffuse.png');
		const material = new THREE.MeshBasicMaterial( { map: texture } );
		sun.mesh = new THREE.Mesh( geometry, material );
		sun.mesh.scale.set(.1, .1, .1);
		sun.system.add(sun.mesh);
	},
);

let earthSystem = new THREE.Group();
// Load a Draco geometry
loader.load(
	// resource URL
	'Earth Geometry.drc',
	// called when the resource is loaded
	function ( geometry ) {
		const texture = new THREE.TextureLoader().load('Earth Diffuse.png');
		const material = new THREE.MeshBasicMaterial( { map: texture } );
		earth.mesh = new THREE.Mesh( geometry, material );
		earth.mesh.scale.set(.03, .03, .03);
		earth.system.add(earth.mesh);
		earth.system.position.x = 150;
	},
);

let moonSystem = new THREE.Group();
// Load a Draco geometry
loader.load(
	// resource URL
	'Moon Geometry.drc',
	// called when the resource is loaded
	function ( geometry ) {
		const texture = new THREE.TextureLoader().load('Moon Diffuse.png');
		const material = new THREE.MeshBasicMaterial( { map: texture } );
		moon.mesh = new THREE.Mesh( geometry, material );
		moon.mesh.scale.set(.01, .01, .01);
		moon.system.add(moon.mesh);
		moon.system.position.x = 30;
		moonMesh.add(new THREE.AxesHelper(1000));
	},
);
sun.system.add(earth.system);
earth.system.add(moon.system);
scene.add(sun.system);

const spaceTexture = new THREE.TextureLoader().load('Sun Diffuse.png');
// scene.background = spaceTexture;

const gui = new dat.GUI();
var obj = { add:function(){ console.log("clicked") }};

gui.add(obj,'add');


function animate() {
	requestAnimationFrame( animate );

	// sunMesh.rotation.y += 0.1 * 1/60;
	// solarSystem.rotation.y += 0.01;
	// earthSystem.rotation.y += 0.2 * 1/60;
	// earthMesh.rotateY(.01);
	// moonSystem.rotation.y += 0.2 * 1/60;
	// moonSystem.rotateY(.002);
	// let speed = (2 * Math.PI * 150) / ;
	let sunRotationSpeed = 2 * Math.PI / 30 * TIME_STEP;
	let earthRotationSpeed = 2 * Math.PI / 1 * TIME_STEP;
	let earthRevolutionSpeed = 2;
	let moonRotationSpeed = 2 * Math.PI / 27.0 * TIME_STEP;

	// console.log(moonRotationSpeed);
	
	sun.mesh.rotateY(sunRotationSpeed);
	earth.mesh.rotateY(earthRotationSpeed);
	moon.mesh.rotateY(moonRotationSpeed);


	renderer.render( scene, camera );
};

animate();