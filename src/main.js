
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
	orbitPivot;
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
		earth.orbitPivot = new THREE.Object3D();
		earth.orbitPivot.add(earth.system);
		sun.system.add(earth.orbitPivot);
		earth.system.add(earth.mesh);
		earth.system.position.x = 150;
	},
);

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
		moon.orbitPivot = new THREE.Object3D();
		moon.orbitPivot.add(moon.system);
		earth.system.add(moon.orbitPivot);
		moon.system.add(moon.mesh);
		moon.system.position.x = 30;
		earth.system.add(moon.orbitPivot);
		moon.mesh.add(new THREE.AxesHelper(1000));
	},
);
scene.add(new THREE.AxesHelper(1000));
scene.add(sun.system);

const spaceTexture = new THREE.TextureLoader().load('Galaxy Background.png');
scene.environment = spaceTexture;

const gui = new dat.GUI();
var obj = { 
	LookAtSun: function() {
		let target = new THREE.Vector3();
		sun.system.getWorldPosition(target);
		camera.lookAt(target);
		// controls.update();
	},
	LookAtEarth: function() {
		let target = new THREE.Vector3();
		earth.system.getWorldPosition(target);
		camera.lookAt(target);
		// controls.update();
	},
	LookAtMoon: function() {
		let target = new THREE.Vector3();
		moon.system.getWorldPosition(target);
		camera.lookAt(target);
		// controls.update();
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
	let sunRotationSpeed = 2 * Math.PI * (1/30) * delta;
	let earthRotationSpeed = 2 * Math.PI * delta;
	let earthRevolutionSpeed = 2 * Math.PI * (1/365) * delta;
	let moonRotationSpeed = 2 * Math.PI * (1/27) * delta;
	let moonRevolutionSpeed = 2 * Math.PI * (1/27) * delta;

	sun.mesh.rotateY(sunRotationSpeed);
	earth.mesh.rotateY(earthRotationSpeed);
	earth.orbitPivot.rotateY(earthRevolutionSpeed);
	moon.mesh.rotateY(moonRotationSpeed);
	moon.orbitPivot.rotateY(moonRevolutionSpeed);
	
	stats.update()
	renderer.render( scene, camera );
};

animate();