// import * as THREE from 'three/webgpu'
// import Experience from '@experience/Experience.js'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { TransformControls } from 'three/addons/controls/TransformControls.js';

// export default class Camera
// {
//     constructor( parameters = {} )
//     {
//         this.experience = Experience.getInstance()
//         this.renderer = this.experience.renderer.instance
//         this.sizes = this.experience.sizes
//         this.time = this.experience.time
//         this.canvas = this.experience.canvas
//         this.timeline = this.experience.timeline
//         this.scene = parameters.world.scene
//         this.cursorEnabled = false

//         this.lerpVector = new THREE.Vector3();

//         this.setInstance()
//         this.setControls()
//     }

//     setInstance()
//     {
//         //const FOV = this.experience.isMobile ? 35 : 25
//         this.instance = new THREE.PerspectiveCamera(50, this.sizes.width / this.sizes.height, 0.1, 2000)
//         this.defaultCameraPosition = new THREE.Vector3(1, 0.5, 3);

//         this.instance.position.copy(this.defaultCameraPosition)
//         this.instance.lookAt(new THREE.Vector3(0, 0, 0));

//         this.lerpVector.copy(this.instance.position);
//     }

//     setControls()
//     {
//         this.controls = new OrbitControls(this.instance, this.canvas)
//         this.controls.enableDamping = true
//         this.controls.minDistance = 0;
//         this.controls.maxDistance = 1000;
//         this.controls.enabled = true;
//         this.controls.target = new THREE.Vector3(0, 0, 0);


//         // this.controls.mouseButtons = {
//         //     LEFT: THREE.MOUSE.ROTATE,
//         //     MIDDLE: null,
//         //     RIGHT: null,  // Отключает действие для правой кнопки мыши
//         // };
//         //
//         // this.controls.enableZoom = false;


//         this.transformControls = new TransformControls( this.instance, this.renderer.domElement );
//         //this.transformControls.addEventListener( 'change', render );
//         this.transformControls.addEventListener( 'dragging-changed', ( event ) => {
//             this.controls.enabled = ! event.value;
//         } );

//         this.scene.add( this.transformControls.getHelper() );

//         this._setListeners()
//     }

//     _setListeners() {
//         const control = this.transformControls;
//         window.addEventListener( 'keydown', ( event ) => {

//             switch ( event.key ) {

//                 case 'q':
//                     control.setSpace( control.space === 'local' ? 'world' : 'local' );
//                     break;

//                 case 'Shift':
//                     control.setTranslationSnap( 1 );
//                     control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
//                     control.setScaleSnap( 0.25 );
//                     break;

//                 case 'w':
//                     control.setMode( 'translate' );
//                     break;

//                 case 'e':
//                     control.setMode( 'rotate' );
//                     break;

//                 case 'r':
//                     control.setMode( 'scale' );
//                     break;

//                 case '+':
//                 case '=':
//                     control.setSize( control.size + 0.1 );
//                     break;

//                 case '-':
//                 case '_':
//                     control.setSize( Math.max( control.size - 0.1, 0.1 ) );
//                     break;

//                 case 'x':
//                     control.showX = ! control.showX;
//                     break;

//                 case 'y':
//                     control.showY = ! control.showY;
//                     break;

//                 case 'z':
//                     control.showZ = ! control.showZ;
//                     break;

//                 case ' ':
//                     control.enabled = ! control.enabled;
//                     break;

//                 case 'Escape':
//                     control.reset();
//                     break;

//             }

//         } );

//         window.addEventListener( 'keyup', function ( event ) {

//             switch ( event.key ) {

//                 case 'Shift':
//                     control.setTranslationSnap( null );
//                     control.setRotationSnap( null );
//                     control.setScaleSnap( null );
//                     break;

//             }

//         } );
//     }

//     resize()
//     {
//         this.instance.aspect = this.sizes.width / this.sizes.height
//         this.instance.updateProjectionMatrix()
//     }

//     update()
//     {
//         this.controls?.update()

//         this.instance.updateMatrixWorld() // To be used in projection
//     }

//     animateCameraPosition() {

//     }
// }

import * as THREE from 'three/webgpu'
import Experience from '@experience/Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export default class Camera
{
    constructor( parameters = {} )
    {
        this.experience = Experience.getInstance()
        this.renderer = this.experience.renderer.instance
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.canvas = this.experience.canvas
        this.timeline = this.experience.timeline
        this.scene = parameters.world.scene
        this.cursorEnabled = false

        this.lerpVector = new THREE.Vector3();

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        // Calculate responsive FOV and position
        const aspect = this.sizes.width / this.sizes.height;
        const isMobile = this.experience.isMobile;
        const isPortrait = aspect < 1;
        const isXS = this.sizes.width < 480; // Extra small devices
        
        // Adjust FOV based on device and orientation
        let fov;
        if (isXS) {
            // Extra small devices - wider FOV to show full black hole
            fov = isPortrait ? 70 : 60;
        } else if (isMobile) {
            // Regular mobile devices
            fov = isPortrait ? 65 : 55;
        } else {
            // Desktop gets narrower FOV
            fov = 50;
        }
        
        this.instance = new THREE.PerspectiveCamera(fov, aspect, 0.1, 2000)
        
        // Adjust camera position based on screen size
        // Less distance = bigger black hole
        let zDistance;
        if (isXS) {
            // Extra small devices - moderate distance
            if (isPortrait) {
                zDistance = 4.8; // Closer than before for bigger size
            } else {
                zDistance = 4.2;
            }
        } else if (isMobile) {
            if (isPortrait) {
                zDistance = 4.5;
            } else {
                zDistance = 4.0;
            }
        } else if (aspect < 1.2) {
            // Narrow desktop window
            zDistance = 4.0;
        } else {
            // Normal desktop - ORIGINAL POSITION
            zDistance = 3;
        }
        
        // ORIGINAL POSITION - Keep the original coordinates
        this.defaultCameraPosition = new THREE.Vector3(1, 0.5, zDistance);

        this.instance.position.copy(this.defaultCameraPosition)
        this.instance.lookAt(new THREE.Vector3(0, 0, 0));

        this.lerpVector.copy(this.instance.position);
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.minDistance = 0;
        this.controls.maxDistance = 1000;
        this.controls.enabled = true;
        this.controls.target = new THREE.Vector3(0, 0, 0);

        this.transformControls = new TransformControls( this.instance, this.renderer.domElement );
        this.transformControls.addEventListener( 'dragging-changed', ( event ) => {
            this.controls.enabled = ! event.value;
        } );

        this.scene.add( this.transformControls.getHelper() );

        this._setListeners()
    }

    _setListeners() {
        const control = this.transformControls;
        window.addEventListener( 'keydown', ( event ) => {

            switch ( event.key ) {

                case 'q':
                    control.setSpace( control.space === 'local' ? 'world' : 'local' );
                    break;

                case 'Shift':
                    control.setTranslationSnap( 1 );
                    control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
                    control.setScaleSnap( 0.25 );
                    break;

                case 'w':
                    control.setMode( 'translate' );
                    break;

                case 'e':
                    control.setMode( 'rotate' );
                    break;

                case 'r':
                    control.setMode( 'scale' );
                    break;

                case '+':
                case '=':
                    control.setSize( control.size + 0.1 );
                    break;

                case '-':
                case '_':
                    control.setSize( Math.max( control.size - 0.1, 0.1 ) );
                    break;

                case 'x':
                    control.showX = ! control.showX;
                    break;

                case 'y':
                    control.showY = ! control.showY;
                    break;

                case 'z':
                    control.showZ = ! control.showZ;
                    break;

                case ' ':
                    control.enabled = ! control.enabled;
                    break;

                case 'Escape':
                    control.reset();
                    break;

            }

        } );

        window.addEventListener( 'keyup', function ( event ) {

            switch ( event.key ) {

                case 'Shift':
                    control.setTranslationSnap( null );
                    control.setRotationSnap( null );
                    control.setScaleSnap( null );
                    break;

            }

        } );
    }

    resize()
    {
        // Recalculate responsive values on resize
        const aspect = this.sizes.width / this.sizes.height;
        const isMobile = this.experience.isMobile;
        const isPortrait = aspect < 1;
        const isXS = this.sizes.width < 480;
        
        // Update FOV
        let fov;
        if (isXS) {
            fov = isPortrait ? 70 : 60;
        } else if (isMobile) {
            fov = isPortrait ? 65 : 55;
        } else {
            fov = 50;
        }
        
        this.instance.fov = fov;
        this.instance.aspect = aspect;
        this.instance.updateProjectionMatrix();
        
        // Update camera position
        let zDistance;
        if (isXS) {
            if (isPortrait) {
                zDistance = 4.8;
            } else {
                zDistance = 4.2;
            }
        } else if (isMobile) {
            if (isPortrait) {
                zDistance = 4.5;
            } else {
                zDistance = 4.0;
            }
        } else if (aspect < 1.2) {
            zDistance = 4.0;
        } else {
            zDistance = 3;
        }
        
        // Smoothly update position
        this.defaultCameraPosition.z = zDistance;
        this.instance.position.setZ(zDistance);
        this.lerpVector.setZ(zDistance);
    }

    update()
    {
        this.controls?.update()

        this.instance.updateMatrixWorld() // To be used in projection
    }

    animateCameraPosition() {

    }
}
