import * as THREE from 'three/webgpu'
import Experience from '@experience/Experience.js'
import { normalWorld } from 'three/tsl'

export default class Environment {
    constructor(parameters = {}) {
        this.experience = new Experience()
        this.state = this.experience.state
        this.world = parameters.world
        this.scene = this.world.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.renderer = this.experience.renderer.instance
        this.uniforms = this.state.uniforms.mainScene.environment

        this.scene.colorSpace = THREE.SRGBColorSpace

        this.setBackground()
        this._setDebug()
    }

    setBackground() {
        const colorNode = normalWorld.y.mix(this.uniforms.topColor, this.uniforms.bottomColor)
        this.scene.backgroundNode = colorNode
        this.scene.environmentNode = colorNode
    }

    _setDebug() {
        if (!this.debug.active) return

        const folder = this.world.debugFolder.addFolder({
            title: 'Environment',
            expanded: false
        })

        folder.addBinding(this.uniforms.topColor, 'value', { label: 'Top Color', color: { type: 'float' } })
        folder.addBinding(this.uniforms.bottomColor, 'value', { label: 'Bottom Color', color: { type: 'float' } })
    }

    // REQUIRED LIFECYCLE METHODS
    postInit() { }
    animationPipeline() { }
    resize() { }
    update() { }
    postUpdate() { }
    destroy() { }
}
