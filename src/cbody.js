import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export default class CBody {
    // static dracoLoader;
    mesh;

    constructor(dracosrc, scale, positionX, textureFile) {
        this.dracosrc = dracosrc;
        this.scale = scale;
        this.positionX = positionX;
        this.textureFile = textureFile;
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/v1/decoders/' );
        this.mesh = new THREE.Object3D();
    }
    
    getMesh() {
        // Load a Draco geometry
        if(this.mesh === undefined || this.mesh === null) {
            this.dracoLoader.load(
                // resource URL
                this.dracosrc,
                // called when the resource is loaded
                function ( geometry ) {
                    const texture = new THREE.TextureLoader().load(parent.textureFile);
                    const material = new THREE.MeshBasicMaterial( { map: texture } );
                    parent.mesh = new THREE.Mesh( geometry, material );
                    // this.mesh.scale.set(scale, scale, scale);
                    parent.mesh = mesh;
                },
                // called as loading progresses
                function ( xhr ) {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                // called when loading has errors
                function ( error ) {
                    console.log( 'An error happened' + error);
                }
                );
            console.log(this.mesh.position);
            return this.mesh;
        }
    }
}