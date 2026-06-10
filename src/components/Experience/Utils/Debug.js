import * as THREE from 'three/webgpu'
import * as Helpers from '@experience/Utils/Helpers.js'
import Experience from "@experience/Experience.js";
import Sizes from "./Sizes.js";

import {Fn} from 'three/tsl'

export default class Debug {
    experience = Experience.getInstance()
    sizes = this.experience.sizes

    constructor() {
        // Debug UI disabled by default; set to true to re-enable the pane
        this.active = false
        this.panel = null
    }

    postInit() {
        // this.scene = experience.scene
        //this.camera = this.experience.camera.instance
    }

    createDebugNode( node, world ) {
        this.debugNode = node;
        this.world = world;
        this.scene = world.scene;
        this.camera = world.camera.instance;

        const material = new THREE.SpriteNodeMaterial( {
            // depthWrite: false,
            depthTest: false,
            // //blending: THREE.NoBlending
            toneMapped: false
        } );


        if( node.isNode ) {

            material.colorNode = Fn(() => {
                // const _uv = uv().flipY().toVar()
                // _uv.y.mulAssign( this.sizes.aspectRatio )
                //
                // return convertToTexture( node ).sample( _uv  )
                //return convertToTexture( node )
                //
                return node
            })()
        }

        // material.mrtNode = mrt({
        //     output
        // });

        //material.colorNode = vec4(1, 1, 1, 1);
        // material.fragmentNode = Fn(() =>
        // {
        //     return texture( this.resources.items.displacementTexture, uv() )
        // })()

        const sprite = this.sprite = new THREE.Sprite( material );
        sprite.center.set( 0.0, 0.0 );
        sprite.renderOrder = 10000;

        this.scene.add(sprite);

        this._updateSprite();
    }

    _updateSprite() {
        if ( !this.debugNode ) return;

        const position = Helpers.projectNDCTo3D(-1, -1, this.camera, 10)
        this.sprite.position.copy( position )
    }

    resize() {
        this._updateSprite();
    }

    // update( deltaTime ) {
    //     if ( this.debugNode ) {
    //         this._updateSprite()
    //     }
    // }
}
