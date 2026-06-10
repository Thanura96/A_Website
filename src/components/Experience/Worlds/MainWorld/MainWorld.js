import * as THREE from 'three/webgpu'
import Experience from '@experience/Experience.js'
import DebugHelpers from "../Objects/DebugHelpers.js";
import Time from "@experience/Utils/Time.js";
import EventEmitter from '@experience/Utils/EventEmitter.js';
import Debug from '@experience/Utils/Debug.js';

import Camera from './Camera.js'
import Input from "@experience/Utils/Input.js";
import Environment from "./Environment.js";
import BlackHole from "@experience/Worlds/MainWorld/BlackHole.js";

export default class MainWorld extends EventEmitter {
    experience = Experience.getInstance()
    time = this.experience.time
    debug = this.experience.debug
    state = this.experience.state
    renderer = this.experience.renderer.instance
    scene = new THREE.Scene()
    camera = new Camera({ world: this })
    input = new Input({ camera: this.camera.instance })
    resources = this.experience.resources
    html = this.experience.html
    sound = this.experience.sound

    uniforms = this.state.uniforms.mainScene

    enabled = true

    constructor() {
        super();

        this._setDebug()

        this.init()

        this.scene.add(this.camera.instance)
    }

    init() {
        this.blackHole = new BlackHole({ world: this })
        this.environment = new Environment({ world: this })
        this.debugHelpers = new DebugHelpers({ world: this })
    }

    // ─────────────────────────────────────────────────────────────
    // REQUIRED LIFECYCLE METHODS (2025 Experience Framework)
    // ─────────────────────────────────────────────────────────────

    animationPipeline() {
        this.blackHole?.animationPipeline()
        this.environment?.animationPipeline()
        this.debugHelpers?.animationPipeline()
    }

    postInit() {
        this.blackHole?.postInit()
        this.environment?.postInit()
        this.debugHelpers?.postInit()
    }

    resize() {
        this.camera?.resize()
        this.blackHole?.resize()
        this.environment?.resize()
        this.debugHelpers?.resize()
    }

    update(deltaTime) {
        if (!this.enabled) return

        this.debugHelpers?.update(deltaTime)
        this.blackHole?.update(deltaTime)
        this.environment?.update?.(deltaTime)  // optional if not needed
        this.camera?.update()
    }

    // THIS WAS MISSING → THIS IS THE FIX
    postUpdate(deltaTime) {
        // Runs AFTER render() and before post-processing
        // Perfect for: screenshots, debug overlays, late effects, analytics, etc.

        this.blackHole?.postUpdate?.(deltaTime)
        this.environment?.postUpdate?.(deltaTime)
        this.debugHelpers?.postUpdate?.(deltaTime)
    }

    // Optional but recommended
    destroy() {
        this.blackHole?.destroy?.()
        this.environment?.destroy?.()
        this.debugHelpers?.destroy?.()
        this.camera?.destroy?.()
    }
    

    // ─────────────────────────────────────────────────────────────
    // DEBUG
    // ─────────────────────────────────────────────────────────────
    _setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.panel.addFolder({
            title: 'Main World',
            expanded: true
        })

        const postProcessFolder = this.debugFolder.addFolder({
            title: 'PostProcess',
            expanded: false
        })

        postProcessFolder.addBinding(this.state.uniforms.mainScene.bloomPass.strength, 'value', {
            min: 0, max: 5, step: 0.001, label: 'Bloom Strength'
        })

        postProcessFolder.addBinding(this.state.uniforms.mainScene.bloomPass.radius, 'value', {
            min: -2, max: 1, step: 0.001, label: 'Bloom Radius'
        })

        postProcessFolder.addBinding(this.state.uniforms.mainScene.bloomPass.threshold, 'value', {
            min: 0, max: 1, step: 0.001, label: 'Bloom Threshold'
        })
    }
}
