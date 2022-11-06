
import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as dat from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module'

const sunRotationSpeed = 2 * Math.PI * (1/30);
const earthRotationSpeed = 2 * Math.PI;
const earthRevolutionSpeed = 2 * Math.PI * (1/365);
const moonRotationSpeed = 2 * Math.PI * (1/27);
const moonRevolutionSpeed = 2 * Math.PI  * (1/27);
const earthDistance = 150;
const moonDistance = 30;
const sunRadius = 0.1;
const earthRadius = .03;
const moonRadius = 0.01;

// Main organizational body for Celestial Bodies. Bodies revolve around a orbitPoint.
// System is a group that contains all Bodies that would orbit around it
class Body {
	orbitPivot;
	system;
	mesh;
}

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -200;
camera.position.y = 200;
camera.position.z = 200;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointlight = new THREE.PointLight(0xffffff, 2);
scene.add(pointlight);

const controls = new OrbitControls(camera, renderer.domElement);

// Instantiate a loader
const loader = new DRACOLoader();
// Specify path to a folder containing WASM/JS decoding libraries.
loader.setDecoderPath( 'https://www.gstatic.com/draco/v1/decoders/' );


var sun = new Body();
var earth = new Body();
var moon = new Body();
sun.system = new THREE.Group();
earth.system = new THREE.Group();
moon.system = new THREE.Group();

scene.add(sun.system);

// Load a Draco geometry
loader.load(
	// resource URL
	'Sun Geometry.drc',
	// called when the resource is loaded
	function ( geometry ) {
		const texture = new THREE.TextureLoader().load('Sun Diffuse.png');
		const material = new THREE.MeshBasicMaterial( { map: texture } );
		sun.mesh = new THREE.Mesh( geometry, material );
		sun.mesh.scale.set(sunRadius, sunRadius, sunRadius);
		sun.system.add(sun.mesh);
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
		earth.mesh.scale.set(earthRadius, earthRadius, earthRadius);
		// Create orbit point centered at the system the earth belongs to
		earth.orbitPivot = new THREE.Object3D();
		earth.orbitPivot.add(earth.system);
		sun.system.add(earth.orbitPivot);
		earth.system.add(earth.mesh);
		earth.system.position.x = earthDistance;
	},
);

// Load a Draco geometry
loader.load(
	// resource URL
	'Moon Geometry.drc',
	// called when the resource is loaded
	function ( geometry ) {
		const texture = new THREE.TextureLoader().load('Moon Diffuse.png');
		const material = new THREE.MeshStandardMaterial( { map: texture } );
		moon.mesh = new THREE.Mesh( geometry, material );
		moon.mesh.scale.set(moonRadius, moonRadius, moonRadius);
		// Create orbit point centered at the system the moon belongs to
		moon.orbitPivot = new THREE.Object3D();
		moon.orbitPivot.add(moon.system);
		earth.system.add(moon.orbitPivot);
		moon.system.add(moon.mesh);
		moon.system.position.x = moonDistance;
	},
);

// Dat.GUI interface for debugging
const gui = new dat.GUI();
var commands = { 
	TimeScale: 1,
};
gui.add(commands,'TimeScale',0.1,10.0)
	.name('scale time')

// Display Performance Statistics
const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
	requestAnimationFrame( animate );

	let delta = clock.getDelta();

	sun.mesh.rotateY(sunRotationSpeed * delta * commands.TimeScale);
	earth.mesh.rotateY(earthRotationSpeed * delta * commands.TimeScale);
	earth.mesh.rotateY(-1*earthRevolutionSpeed * delta * commands.TimeScale);	// reverse the effect of the revolution
	earth.orbitPivot.rotateY(earthRevolutionSpeed * delta * commands.TimeScale);
	moon.mesh.rotateY(moonRotationSpeed * delta * commands.TimeScale);
	moon.mesh.rotateY(-1*moonRevolutionSpeed * delta * commands.TimeScale);
	moon.orbitPivot.rotateY(moonRevolutionSpeed * delta * commands.TimeScale);
	stats.update()
	renderer.render( scene, camera );
};

animate();