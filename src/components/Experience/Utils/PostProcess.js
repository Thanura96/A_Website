import * as THREE from 'three/webgpu'
import * as Helpers from '@experience/Utils/Helpers.js'
import Experience from '@experience/Experience.js'
import Debug from '@experience/Utils/Debug.js'
import State from "@experience/State.js";
import Sizes from "./Sizes.js";
import Materials from "@experience/Materials/Materials.js";


import {
    float, uniform, pass, mrt, output, emissive, texture, Fn, uv, screenUV,
    vec2, vec4, distance, convertToTexture, mix, If, sin, cos
} from 'three/tsl';

import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { transition } from 'three/addons/tsl/display/TransitionNode.js';



export default class PostProcess {
    experience = Experience.getInstance()
    debug = this.experience.debug
    sizes = this.experience.sizes
    state = this.experience.state
    materials = Materials.getInstance()

    rendererClass = this.experience.renderer
    scene = this.experience.scene
    time = this.experience.time
    resources = this.experience.resources
    timeline = this.experience.time.timeline;
    container = new THREE.Group();
    passes = {}

    transitionPassParams = {
        progress: uniform( 0.0 ), // progress 0 -> 1
        threshold: uniform( 0.1 ), // threshold
        useTexture: uniform( 1 ), // use texture
        uvScale: uniform( vec2( 1, 1 ) ),
        uvOffset: uniform( vec2( 0, 0 ) )
    }

    constructor( renderer ) {
        this.renderer = renderer
        this.composer = new THREE.PostProcessing( this.renderer );
    }

    postInit() {
        this.worlds = this.experience.worlds
        this.mainWorld = this.worlds.mainWorld

        this.setComposer()
        this.setDebug()
    }

    setComposer() {
        //this._setTextures()
        this._sceneMainPass()


        this.composer.outputNode = this.scenePassColorMain.add( this.bloomPassMain );
        //composer.outputNode = scenePassColorMain.add( ...Object.values( this.passes ) );

        //composer.outputColorTransform = false


        // linearDepth() returns the linear depth of the mesh
        // const depth = linearDepth();
        // const depthWater = viewportLinearDepth.sub( depth );
        // const depthEffect = depthWater.remapClamp( - .002, .04 );
        //
        // const refractionUV = screenUV.add( vec2( 0, waterIntensity.mul( .1 ) ) );
        //
        // // linearDepth( viewportDepthTexture( uv ) ) return the linear depth of the scene
        // const depthTestForRefraction = linearDepth( viewportDepthTexture( refractionUV ) ).sub( depth );
    }

    // Textures
    _setTextures() {
        const displacementTexture = this.displacementTexture = this.resources.items.displacementTexture;
        //const displacementTexture = this.displacementTexture = this.resources.items.voronoiNoiseTexture;
        displacementTexture.wrapS = THREE.RepeatWrapping;
        displacementTexture.wrapT = THREE.RepeatWrapping;


        this._calculateUVTransform( displacementTexture );
        this.uResolution = this.state.uniforms.resolution;

        this.displacementTextureNode = texture(
            this.displacementTexture,
            uv().mul( this.transitionPassParams.uvScale )
                .add( this.transitionPassParams.uvOffset )
                .mul( this.uniforms.transitionPassParams.uvMultiplier )
        )
    }

    _sceneMainPass() {
        const scenePassMain = pass( this.mainWorld.scene, this.mainWorld.camera.instance, {} );

        scenePassMain.setMRT( mrt( {
            output,
            emissive,
        } ) );

        const scenePassColorMain = this.scenePassColorMain = scenePassMain.getTextureNode( 'output' );
        scenePassMain.getTextureNode( 'emissive' );

        const bloomPassMain = this.bloomPassMain = this.passes.bloomPassMain = bloom(
            scenePassColorMain,
            this.state.uniforms.mainScene.bloomPass.strength,
            this.state.uniforms.mainScene.bloomPass.radius,
            this.state.uniforms.mainScene.bloomPass.threshold,
        );

        bloomPassMain.strength = this.state.uniforms.mainScene.bloomPass.strength
        bloomPassMain.radius = this.state.uniforms.mainScene.bloomPass.radius
        bloomPassMain.threshold = this.state.uniforms.mainScene.bloomPass.threshold
    }

    _transitionPass() {

        const transitionTexture = Fn( ( params ) => {
            const noiseTexture = params.noiseTexture
            const uResolution = params.uResolution.toVar()
            const aspect = uResolution.x.div( uResolution.y ).toVar()

            let uv = screenUV.div( vec2( 1, aspect ) ).toVar()
            let dist = distance( uv, vec2( 0.5, float( 0.5 ).div( aspect ) ) ).toVar()
            dist = dist.mul( noiseTexture.r )

            return vec4( dist );
        } )

        this.transitionPass = transition(
            this.scenePassMainFinalColor,
            this.scenePassPreloadFinalColor,
            transitionTexture( {
                uResolution: this.state.uniforms.resolution,
                noiseTexture: this.displacementTextureNode,
            } ),
            //texture(displacementTexture, uv().mul( this.transitionPassParams.uvScale ).add( this.transitionPassParams.uvOffset ).mul( 2 )),
            this.uniforms.transitionPassParams.progress,
            this.uniforms.transitionPassParams.threshold,
            this.uniforms.transitionPassParams.useTexture
        );
    }

    setDisplacementPass( nodeA, nodeB ) {
        // composer.outputNode = Fn( ( params ) => {
        //     const transitionPass = this.transitionPass
        //     const scenePassPreloadTexture = convertToTexture( this.scenePassPreloadFinalColor )
        //     const scenePassMainTexture = convertToTexture( this.scenePassMainFinalColor )
        //
        //     const displace1 = scenePassPreloadTexture.r.add( scenePassPreloadTexture.g ).add( scenePassPreloadTexture.b ).mul( 0.33 )
        //     const displace2 = scenePassMainTexture.r.add( scenePassMainTexture.g ).add( scenePassMainTexture.b ).mul( 0.33 )
        //
        //     const t1 = scenePassPreloadTexture.sample( vec2( screenUV.x, screenUV.y.add( this.uniforms.displacementPassParams.progress.mul( displace2 ).mul( this.uniforms.displacementPassParams.intensity ) ) ) )
        //     const t2 = scenePassMainTexture.sample( vec2( screenUV.x, screenUV.y.add( oneMinus( this.uniforms.displacementPassParams.progress ).mul( displace1 ).mul( this.uniforms.displacementPassParams.intensity ) ) ) )
        //
        //     return mix( t1, t2, this.uniforms.displacementPassParams.progress )
        // } )( {} )

        this.composer.outputNode = Fn( () => {
            const PI = float( 3.1415 );
            const angle1 = PI.mul( 0.25 );
            const angle2 = PI.mul( -0.75 );

            const scenePassPreloadTexture = convertToTexture( nodeA )
            const scenePassMainFinalTexture = convertToTexture( nodeB )

            const disp = this.displacementTextureNode
            const dispVec = vec2( disp.r, disp.g )
            const dispScaled = dispVec.mul( this.uniforms.displacementPassParams.intensity )

            const rotateVec2 = ( vec, angle ) => {
                const c = cos( angle )
                const s = sin( angle )
                return vec2(
                    vec.x.mul( c ).sub( vec.y.mul( s ) ),
                    vec.x.mul( s ).add( vec.y.mul( c ) )
                )
            }

            const displacement1 = rotateVec2( dispScaled.mul( this.uniforms.displacementPassParams.progress ), angle1 )
            const distortedPosition1 = screenUV.sub( displacement1.yx )
            const t1 = scenePassPreloadTexture.sample( distortedPosition1 ).toVar()

            const displacement2 = rotateVec2( dispScaled.mul( float( 1.0 ).sub( this.uniforms.displacementPassParams.progress ) ), angle2 ).toVar()
            const distortedPosition2 = screenUV.sub( displacement2.yx ).toVar();
            const t2 = scenePassMainFinalTexture.sample( distortedPosition2 ).toVar()

            If( distortedPosition2.y.greaterThan( 1 ), () => {
                t2.assign( vec4( 0 ) )
            } )

            If( distortedPosition2.y.lessThan( 0 ), () => {
                t2.assign( vec4( 0 ) )
            } )

            If( distortedPosition2.x.greaterThan( 1 ), () => {
                t2.assign( vec4( 0 ) )
            } )

            If( distortedPosition2.x.lessThan( 0 ), () => {
                t2.assign( vec4( 0 ) )
            } )


            return mix( t1, t2, this.uniforms.displacementPassParams.progress )
        } )( {} )
    }

    _calculateUVTransform() {
        const { uvScale, uvOffset } = Helpers.calculateUVTransform( this.displacementTexture, this.sizes );

        this.transitionPassParams.uvScale.value.set( uvScale.x, uvScale.y );
        this.transitionPassParams.uvOffset.value.set( uvOffset.x, uvOffset.y );
    }

    resize() {
        //this._calculateUVTransform()
        this.composer.needsUpdate = true
    }

    setDebug() {
        if ( !this.debug.active || !this.debug.panel ) return
    }

    productionRender() {
        return this.composer.render() // Render Async bug on resize
    }

    debugRender() {
        return this.composer.render() // Render Async bug on resize
    }

    update() {
        if ( this.debug.active ) {
            return this.debugRender()
        } else {
            return this.productionRender()
        }
    }

}
