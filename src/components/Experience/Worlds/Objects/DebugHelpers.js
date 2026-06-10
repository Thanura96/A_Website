import * as THREE from 'three/webgpu'
import Experience from '@experience/Experience.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js'
import Gizmo from '@experience/Utils/Gizmo.js'
import gridMaterial from '@experience/Materials/GridMaterialTexture.js'
import { _hash } from "@experience/Utils/TSL-utils.js";

export default class DebugHelpers {
    experience = new Experience()
    debug = this.experience.debug
    time = this.experience.time
    renderer = this.experience.renderer.instance
    resources = this.experience.resources
    cursor = this.experience.cursor
    timeline = this.experience.timeline;
    controls = this.experience.camera?.controls
    container = new THREE.Group();

    constructor(parameters = {}) {
        if (!this.debug.active) return

        this.world = parameters.world
        this.scene = this.world.scene
        this.camera = this.world.camera.instance

        this.setupDebugFeatures()
    }

    setupDebugFeatures() {
        this.addViewHelper()
        //this.addGlobalAxes()
        //this.addGrid()
    }

    addGlobalAxes() {
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    addViewHelper() {
        this.gizmo = new Gizmo(this.camera, { size: 100, padding: 8 });
        document.body.appendChild(this.gizmo);
        this.gizmo.onAxisSelected = function (axis) {
            console.log(axis); // { axis: "x", direction: THREE.Vector3(1,0,0) }
        }
    }

    addGrid() {
        /**
         * Grid
         */
        // const grid = new THREE.Mesh(
        //     new THREE.PlaneGeometry(100, 100),
        //     gridMaterial
        // )
        // grid.rotation.x = - Math.PI * 0.5
        // grid.position.y = 0
        // this.scene.add(grid)


        const gridTexture = this.resources.items.gridTexture
        gridTexture.wrapS = THREE.RepeatWrapping;
        gridTexture.wrapT = THREE.RepeatWrapping;
        gridTexture.generateMipmaps = true
        gridTexture.minFilter = THREE.LinearMipMapLinearFilter;
        gridTexture.magFilter = THREE.LinearFilter;

        gridMaterial.map = gridTexture

        const grid = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            gridMaterial
        )

        grid.rotateX(-Math.PI / 2);
        this.scene.add(grid)
    }

    // ─────────────────────────────────────────────────────────────
    // LIFECYCLE METHODS (2025 Experience Framework)
    // ─────────────────────────────────────────────────────────────

    animationPipeline() {
        // Called to set up GSAP animations if needed
    }

    postInit() {
        // Called after resources are loaded and world is initialized
    }

    resize() {
        // Called on window resize
    }

    update() {
        this.gizmo?.update();
    }

    postUpdate() {
        // Called after render() and before post-processing
    }

    destroy() {
        // Clean up resources
        if (this.gizmo) {
            this.gizmo.remove();
            this.gizmo = null;
        }
    }

}
