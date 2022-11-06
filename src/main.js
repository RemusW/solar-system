
import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import CBody from './cbody';
import * as dat from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module'

class Body {
	mesh;
	system;
}

const TIME_STEP = 1/60;
const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const pointlight = new THREE.PointLight(0xffffff, 2);
pointlight.scale.set(20,20,20);
scene.add(pointlight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.z = 200;

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
		sun.mesh.add(new THREE.AxesHelper(1000));
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
		const normalMap = new THREE.TextureLoader().load('Earth Normal.png');
		const material = new THREE.MeshStandardMaterial( { map: texture, normalMap: normalMap } );
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
		console.log(moon.system.matrixWorld);
		moon.mesh.add(new THREE.AxesHelper(1000));
	},
);
sun.system.add(earth.system);
earth.system.add(moon.system);
scene.add(new THREE.AxesHelper(1000));
scene.add(sun.system);

const spaceTexture = new THREE.TextureLoader().load('Sun Diffuse.png');
// scene.background = spaceTexture;

const gui = new dat.GUI();
var obj = { 
	LookAtSun: function() {
		let target = new THREE.Vector3();
		sun.system.getWorldPosition(target);
		camera.lookAt(target);
		controls.update();
	},
	LookAtEarth: function() {
		let target = new THREE.Vector3();
		earth.system.getWorldPosition(target);
		camera.lookAt(target);
		controls.update();
	},
	LookAtMoon: function() {
		let target = new THREE.Vector3();
		moon.system.getWorldPosition(target);
		camera.lookAt(target);
		controls.update();
	}
};

gui.add(obj,'LookAtSun');
gui.add(obj,'LookAtEarth');
gui.add(obj,'LookAtMoon');

const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
	requestAnimationFrame( animate );

	let delta = clock.getDelta();
	// sunMesh.rotation.y += 0.1 * 1/60;
	// solarSystem.rotation.y += 0.01;
	// earthSystem.rotation.y += 0.2 * 1/60;
	// earthMesh.rotateY(.01);
	// moonSystem.rotation.y += 0.2 * 1/60;
	// moonSystem.rotateY(.002);
	// let speed = (2 * Math.PI * 150) / ;
	let sunRotationSpeed = 2 * Math.PI * (1/30) * delta;
	let earthRotationSpeed = 2 * Math.PI * delta;
	let earthRevolutionSpeed = 2 * Math.PI * (1/365) * delta;
	let moonRotationSpeed = 2 * Math.PI * (1/27) * delta;
	let moonRevolutionSpeed = 2 * Math.PI * (1/27) * delta;

	sun.mesh.rotateY(sunRotationSpeed);
	earth.mesh.rotateY(earthRotationSpeed);
	earth.system.rotateY(earthRevolutionSpeed);
	moon.mesh.rotateY(moonRotationSpeed);
	moon.system.rotateY(moonRevolutionSpeed);
	
	stats.update()
	renderer.render( scene, camera );
};

animate();