import * as THREE from 'three/webgpu';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

import EventEmitter from './EventEmitter.js';
import Experience from '@experience/Experience.js';

export default class Resources extends EventEmitter {
    experience = Experience.getInstance();
    renderer = this.experience.renderer.instance;

    constructor( sources ) {
        super();

        this.sources = sources;
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;
        this.loadedAll = false;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};

        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.objLoader = new OBJLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
        this.loaders.hdrLoader = new HDRLoader();
        this.loaders.EXRLoader = new EXRLoader();
        this.loaders.fontLoader = new FontLoader();
        this.loaders.AudioLoader = new THREE.AudioLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/draco/' );

        const ktx2Loader = new KTX2Loader();
        ktx2Loader.setTranscoderPath( '/basis/' );
        try {
            ktx2Loader.detectSupport( this.renderer );
        } catch ( err ) {
            console.warn( 'KTX2Loader: detectSupport skipped until renderer is ready.', err );
        }

        this.loaders.gltfLoader.setDRACOLoader( dracoLoader );
        this.loaders.gltfLoader.setKTX2Loader( ktx2Loader );
        this.loaders.gltfLoader.setMeshoptDecoder( MeshoptDecoder );
    }

    startLoading() {
        for ( const source of this.sources ) {
            switch ( source.type ) {
                case 'gltfModel':
                    this.loaders.gltfLoader.load( source.path, ( file ) => {
                        this.sourceLoaded( source, file );
                    } );
                    break;

                case 'objModel':
                    this.loaders.objLoader.load( source.path, ( file ) => {
                        this.sourceLoaded( source, file );
                    } );
                    break;

                case 'texture':
                    this.loaders.textureLoader.load( source.path, ( file ) => {
                        this.sourceLoaded( source, file );
                    } );
                    break;

                case 'videoTexture': {
                    const video = document.createElement( 'video' );
                    video.src = source.path;
                    video.setAttribute( 'crossorigin', 'anonymous' );
                    video.muted = true;
                    video.loop = true;
                    video.load();
                    video.setAttribute( 'playsinline', '' );
                    video.play();

                    const videoObj = {
                        videoTexture: new THREE.VideoTexture( video ),
                        videoElement: video,
                    };

                    video.addEventListener( 'canplaythrough', () => {
                        this.sourceLoaded( source, videoObj );
                    } );
                    break;
                }

                case 'cubeTexture':
                    this.loaders.cubeTextureLoader.load( source.path, ( file ) => {
                        this.sourceLoaded( source, file );
                    } );
                    break;

                case 'hdrTexture':
                case 'rgbeTexture':
                    this.loaders.hdrLoader.load( source.path, ( texture ) => {
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                        this.sourceLoaded( source, texture );
                    } );
                    break;

                case 'exrTexture':
                    this.loaders.EXRLoader.load( source.path, ( file ) => {
                        this.sourceLoaded( source, file );
                    } );
                    break;

                case 'font':
                    this.loaders.fontLoader.load( source.path, ( file ) => {
                        this.sourceLoaded( source, file );
                    } );
                    break;

                case 'audio':
                    this.loaders.AudioLoader.load( source.path, ( file ) => {
                        this.sourceLoaded( source, file );
                    } );
                    break;

                case 'json':
                    fetch( source.path )
                        .then( ( res ) => res.json() )
                        .then( ( data ) => {
                            this.sourceLoaded( source, data );
                        } );
                    break;
            }
        }

        if ( this.sources.length === 0 ) {
            setTimeout( () => {
                this.loadedAll = true;
                this.trigger( 'ready' );
            } );
        }
    }

    sourceLoaded( source, file ) {
        this.items[ source.name ] = file;
        this.loaded++;

        if ( this.loaded === this.toLoad ) {
            this.loadedAll = true;
            this.trigger( 'ready' );
        }
    }
}
