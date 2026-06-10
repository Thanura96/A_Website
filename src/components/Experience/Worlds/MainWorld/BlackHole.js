// import * as THREE from "three/webgpu";
// import * as Helpers from "@experience/Utils/Helpers.js";
// import Model from "@experience/Worlds/Abstracts/Model.js";
// import Experience from "@experience/Experience.js";
// import Debug from "@experience/Utils/Debug.js";
// import State from "@experience/State.js";

// import {
//   time,
//   vec3,
//   vec4,
//   uniform,
//   color,
//   texture,
//   step,
//   mix,
//   max,
//   Fn,
//   float,
//   abs,
//   normalize,
//   positionWorld,
//   positionGeometry,
//   modelWorldMatrix,
//   faceDirection,
//   cameraPosition,
//   sub,
//   Loop,
//   remapClamp,
// } from "three/tsl";

// import {
//   srgbToLinear,
//   vecToFac,
//   rotateAxis,
//   ColorRamp3_BSpline,
//   whiteNoise2D,
//   lengthSqrt,
//   smoothRange,
// } from "@experience/Utils/TSL-utils.js";

// export default class BlackHole extends Model {
//   experience = Experience.getInstance();
//   debug = this.experience.debug;
//   state = this.experience.state;
//   input = this.experience.input;
//   time = this.experience.time;
//   renderer = this.experience.renderer.instance;
//   resources = this.experience.resources;

//   container = new THREE.Group();

//   uniforms = {
//     iterations: uniform(float(200)),
//     stepSize: uniform(float(0.015)),
//     noiseFactor: uniform(float(0.01)),
//     power: uniform(float(0.3)),

//     clamp1: uniform(float(0.5)),
//     clamp2: uniform(float(1.0)),

//     // clamp2: uniform(float(1.0)),

//     originRadius: uniform(float(0.2)),
//     outerRadius: uniform(float(1.5)),
//     width: uniform(float(0.02)),
//     uvMotion: uniform(float(0)),
//     textureRepeat: uniform(float(0.5)),

//     rampCol1: uniform(color(0.97, 0.98, 1.0)),
//     rampPos1: uniform(float(0.1)),
//     rampCol2: uniform(color(0.33, 0.25, 0.00)),
//     rampPos2: uniform(float(0.6)),
//     rampCol3: uniform(color(0.44, 0.44, 0.44)),
//     rampPos3: uniform(float(1.0)),

//     rampEmission: uniform(float(2.0)),
//     emissionColor: uniform(color(0.01, 0.27, 1.00)),

//     test1: uniform(float(0)),
//     test2: uniform(float(0)),
//     test3: uniform(float(1)),
//     test4: uniform(float(1)),
//   };

//   constructor(parameters = {}) {
//     super();

//     this.world = parameters.world;
//     this.camera = this.world.camera.instance;
//     this.scene = this.world.scene;
//     this.transformControls = this.world.camera.transformControls;

//     this.init();
//     this._setDebug();
//   }

//   // ------------------------------------
//   // INIT
//   // ------------------------------------
//   init() {
//     this.setModel();
//     this.scene.add(this.container);
//   }

//   // ------------------------------------
//   // BUILD MODEL
//   // ------------------------------------
//   setModel() {
//     const geometry = new THREE.SphereGeometry(2, 32, 32);
    

//     // Material
//     const material = new THREE.MeshStandardNodeMaterial({
//       side: THREE.DoubleSide,
//     });

//     // Make sure noise texture works correctly
//     this.resources.items.noiseDeepTexture.wrapS = THREE.RepeatWrapping;
//     this.resources.items.noiseDeepTexture.wrapT = THREE.RepeatWrapping;
//     this.resources.items.noiseDeepTexture.needsUpdate = true;

//     // Raymarch shader (TSL)
//     material.colorNode = Fn(() => {
//       const _step = this.uniforms.stepSize;
//       const noiseAmp = this.uniforms.noiseFactor;
//       const power = this.uniforms.power;
//       const originRadius = this.uniforms.originRadius;
//       const outerRadius = this.uniforms.outerRadius;
//       const bandWidth = this.uniforms.width;
//       const iterCount = this.uniforms.iterations;

//       const objCoords = positionGeometry.mul(vec3(1, 1, -1)).xzy;
//       const isBackface = step(0.0, faceDirection.negate());

//       const camPointObj = cameraPosition
//         .mul(modelWorldMatrix)
//         .mul(vec3(1, 1, -1)).xzy;
//       const startCoords = mix(objCoords, camPointObj.xyz, isBackface);

//       const viewInWorld = normalize(sub(cameraPosition, positionWorld)).mul(
//         vec3(1, 1, -1)
//       ).xzy;

//       const rayDir = viewInWorld.negate();

//       const noiseWhite = whiteNoise2D(objCoords.xy).mul(noiseAmp);
//       const jitter = rayDir.mul(noiseWhite);

//       const rayPos = startCoords.sub(jitter);

//       const colorAcc = vec3(0);
//       const alphaAcc = float(0.0);

//       Loop(iterCount, () => {
//         const rNorm = normalize(rayPos);
//         const rLen = lengthSqrt(rayPos);
//         const steerMag = _step.mul(power).div(rLen.mul(rLen));
//         const range = remapClamp(rLen, 1.0, 0.5, 0.0, 1.0);
//         const steer = rNorm.mul(steerMag.mul(range));
//         const steeredDir = rayDir.sub(steer).normalize();

//         const advance = rayDir.mul(_step);
//         rayPos.addAssign(advance);

//         const xyLen = lengthSqrt(rayPos.mul(vec3(1, 1, 0)));
//         const rotPhase = xyLen.mul(4.27).sub(time.mul(0.1));
//         const uvAxis = vec3(0, 0, 1);
//         const uvRot = rayPos.mul(rotateAxis(uvAxis, rotPhase));
//         const uv = uvRot.mul(this.uniforms.textureRepeat);

//         const noiseDeep = texture(this.resources.items.noiseDeepTexture, uv);

//         const bandMin = bandWidth.negate();
//         const bandEnds = vec3(bandMin, 0.0, bandWidth);
//         const dz = sub(bandEnds, vec3(rayPos.z));
//         const zQuad = dz.mul(dz).div(bandWidth);
//         const zBand = max(bandWidth.sub(zQuad).div(bandWidth), 0.0);

//         const noiseAmp3 = noiseDeep.mul(zBand);
//         const noiseAmpLen = lengthSqrt(noiseAmp3);

//         const uvForNormal = uv.mul(1.002);
//         const noiseNormal = texture(
//           this.resources.items.noiseDeepTexture,
//           uvForNormal
//         ).mul(zBand);

//         const noiseNormalLen = lengthSqrt(noiseNormal);

//         const rampInput = xyLen
//           .add(noiseAmpLen.sub(0.78).mul(1.5))
//           .add(noiseAmpLen.sub(noiseNormalLen).mul(19.75));

//         const rampA = vec4(this.uniforms.rampCol1, this.uniforms.rampPos1);
//         const rampB = vec4(this.uniforms.rampCol2, this.uniforms.rampPos2);
//         const rampC = vec4(this.uniforms.rampCol3, this.uniforms.rampPos3);

//         const baseCol = ColorRamp3_BSpline(rampInput.x, rampA, rampB, rampC);

//         const emissiveCol = baseCol
//           .mul(this.uniforms.rampEmission)
//           .add(this.uniforms.emissionColor);

//         const rLenNow = lengthSqrt(rayPos);
//         const insideCore = rLenNow.lessThan(originRadius);
//         const shadedCol = mix(emissiveCol, vec3(0), insideCore);

//         const zAbs = abs(rayPos.z);
//         const aNoise = noiseAmpLen.sub(0.75).mul(-0.6);
//         const aPre = zAbs.add(aNoise);
//         const aRadial = smoothRange(xyLen, outerRadius, 0.0, 0.0, 1.0);
//         const aBand = smoothRange(aPre, bandWidth, 0, 0, aRadial);
//         const alphaLocal = mix(aBand, 1.0, insideCore);

//         const oneMinusA = alphaAcc.oneMinus();
//         const weight = oneMinusA.mul(vecToFac(alphaLocal));
//         const newColor = mix(colorAcc, shadedCol, weight);
//         const newAlpha = mix(alphaAcc, 1.0, vecToFac(alphaLocal));

//         rayPos.addAssign(advance);
//         rayDir.assign(steeredDir);
//         colorAcc.assign(newColor);
//         alphaAcc.assign(newAlpha);
//       });

//       return srgbToLinear(colorAcc);
//     })();

//     material.emissiveNode = material.colorNode;

//     const mesh = new THREE.Mesh(geometry, material);
//     this.container.add(mesh);
//   }

//   // ------------------------------------
//   // UPDATE LOOP
//   // ------------------------------------
//   update() {
//     // Add rotation or animation if needed
//     // this.container.rotation.y += 0.1 * this.time.delta
//   }
//   postInit() { }
//   // ─────────────────────────────────────────
//   // REQUIRED LIFECYCLE METHODS
//   // ─────────────────────────────────────────

//   animationPipeline() {
//     // Optional — runs before update()
//   }

//   destroy() {
//     // Clean up THREE memory if needed
//     this.container?.removeFromParent();
//   }

//   // ------------------------------------
//   // RESIZE
//   // ------------------------------------
//   resize() { }

//   // ------------------------------------
//   // DEBUG GUI
//   // ------------------------------------
//   _setDebug() {
//     if (!this.debug.active) return;

//     const folder = this.world.debugFolder.addFolder({
//       title: "Black Hole",
//       expanded: true,
//     });

//     folder.addBinding(this.uniforms.iterations, "value", {
//       label: "Iterations",
//     });
//     folder.addBinding(this.uniforms.stepSize, "value", { label: "Step Size" });
//     folder.addBinding(this.uniforms.noiseFactor, "value", {
//       label: "Noise Factor",
//       min: 0,
//       max: 0.1,
//       step: 0.0001,
//     });
//     folder.addBinding(this.uniforms.power, "value", { label: "Power" });
//     folder.addBinding(this.uniforms.originRadius, "value", {
//       label: "Inner Radius",
//       min: 0.0,
//       max: 1.0,
//     });
//     folder.addBinding(this.uniforms.outerRadius, "value", {
//       label: "Outer Radius",
//       min: 1.0,
//       max: 3.0,
//     });
//     folder.addBinding(this.uniforms.width, "value", {
//       label: "Ring Width",
//       min: 0.0,
//       max: 0.5,
//     });
//     folder.addBinding(this.uniforms.textureRepeat, "value", {
//       label: "Texture Repeat",
//       min: 0.1,
//       max: 5.0,
//     });

//     folder.addBinding(this.uniforms.rampCol1, "value", {
//       label: "Ramp Col 1",
//       color: { type: "float" },
//     });
//     folder.addBinding(this.uniforms.rampPos1, "value", { label: "Ramp Pos 1" });
//     folder.addBinding(this.uniforms.rampCol2, "value", {
//       label: "Ramp Col 2",
//       color: { type: "float" },
//     });
//     folder.addBinding(this.uniforms.rampPos2, "value", { label: "Ramp Pos 2" });
//     folder.addBinding(this.uniforms.rampCol3, "value", {
//       label: "Ramp Col 3",
//       color: { type: "float" },
//     });
//     folder.addBinding(this.uniforms.rampPos3, "value", { label: "Ramp Pos 3" });

//     folder.addBinding(this.uniforms.rampEmission, "value", {
//       label: "Ramp Emission",
//     });
//     folder.addBinding(this.uniforms.emissionColor, "value", {
//       label: "Emission Color",
//       color: { type: "float" },
//     });
//   }
// }

import * as THREE from "three/webgpu";
import * as Helpers from "@experience/Utils/Helpers.js";
import Model from "@experience/Worlds/Abstracts/Model.js";
import Experience from "@experience/Experience.js";
import Debug from "@experience/Utils/Debug.js";
import State from "@experience/State.js";

import {
  time,
  vec3,
  vec4,
  uniform,
  color,
  texture,
  step,
  mix,
  max,
  Fn,
  float,
  abs,
  normalize,
  positionWorld,
  positionGeometry,
  modelWorldMatrix,
  faceDirection,
  cameraPosition,
  sub,
  Loop,
  remapClamp,
} from "three/tsl";

import {
  srgbToLinear,
  vecToFac,
  rotateAxis,
  ColorRamp3_BSpline,
  whiteNoise2D,
  lengthSqrt,
  smoothRange,
} from "@experience/Utils/TSL-utils.js";

export default class BlackHole extends Model {
  experience = Experience.getInstance();
  debug = this.experience.debug;
  state = this.experience.state;
  input = this.experience.input;
  time = this.experience.time;
  renderer = this.experience.renderer.instance;
  resources = this.experience.resources;
  sizes = this.experience.sizes;

  container = new THREE.Group();

  uniforms = {
    iterations: uniform(float(200)),
    stepSize: uniform(float(0.015)),
    noiseFactor: uniform(float(0.01)),
    power: uniform(float(0.3)),

    clamp1: uniform(float(0.5)),
    clamp2: uniform(float(1.0)),

    originRadius: uniform(float(0.38)),
    outerRadius: uniform(float(1.58)),
    width: uniform(float(0.018)),
    uvMotion: uniform(float(0)),
    textureRepeat: uniform(float(1.18)),

    rampCol1: uniform(color(1.0, 0.96, 1.0)),
    rampPos1: uniform(float(0.07)),
    rampCol2: uniform(color(0.0, 0.62, 1.0)),
    rampPos2: uniform(float(0.34)),
    rampCol3: uniform(color(0.005, 0.018, 0.065)),
    rampPos3: uniform(float(1.0)),

    rampEmission: uniform(float(2.25)),
    emissionColor: uniform(color(0.0, 0.028, 0.12)),

    test1: uniform(float(0)),
    test2: uniform(float(0)),
    test3: uniform(float(1)),
    test4: uniform(float(1)),
  };

  constructor(parameters = {}) {
    super();

    this.world = parameters.world;
    this.camera = this.world.camera.instance;
    this.scene = this.world.scene;
    this.transformControls = this.world.camera.transformControls;

    this.init();
    this._setDebug();
  }

  // ------------------------------------
  // INIT
  // ------------------------------------
  init() {
    this.setModel();
    this.scene.add(this.container);
    // Remove scale adjustment - keep original size
  }

  // ------------------------------------
  // BUILD MODEL
  // ------------------------------------
  setModel() {
    const geometry = new THREE.SphereGeometry(2, 32, 32);

    // Material
    const material = new THREE.MeshStandardNodeMaterial({
      side: THREE.DoubleSide,
    });

    // Make sure noise texture works correctly
    this.resources.items.noiseDeepTexture.wrapS = THREE.RepeatWrapping;
    this.resources.items.noiseDeepTexture.wrapT = THREE.RepeatWrapping;
    this.resources.items.noiseDeepTexture.needsUpdate = true;

    // Raymarch shader (TSL)
    material.colorNode = Fn(() => {
      const _step = this.uniforms.stepSize;
      const noiseAmp = this.uniforms.noiseFactor;
      const power = this.uniforms.power;
      const originRadius = this.uniforms.originRadius;
      const outerRadius = this.uniforms.outerRadius;
      const bandWidth = this.uniforms.width;
      const iterCount = this.uniforms.iterations;

      const objCoords = positionGeometry.mul(vec3(1, 1, -1)).xzy;
      const isBackface = step(0.0, faceDirection.negate());

      const camPointObj = cameraPosition
        .mul(modelWorldMatrix)
        .mul(vec3(1, 1, -1)).xzy;
      const startCoords = mix(objCoords, camPointObj.xyz, isBackface);

      const viewInWorld = normalize(sub(cameraPosition, positionWorld)).mul(
        vec3(1, 1, -1)
      ).xzy;

      const rayDir = viewInWorld.negate();

      const noiseWhite = whiteNoise2D(objCoords.xy).mul(noiseAmp);
      const jitter = rayDir.mul(noiseWhite);

      const rayPos = startCoords.sub(jitter);

      const colorAcc = vec3(0);
      const alphaAcc = float(0.0);

      Loop(iterCount, () => {
        const rNorm = normalize(rayPos);
        const rLen = lengthSqrt(rayPos);
        const steerMag = _step.mul(power).div(rLen.mul(rLen));
        const range = remapClamp(rLen, 1.0, 0.5, 0.0, 1.0);
        const steer = rNorm.mul(steerMag.mul(range));
        const steeredDir = rayDir.sub(steer).normalize();

        const advance = rayDir.mul(_step);
        rayPos.addAssign(advance);

        const xyLen = lengthSqrt(rayPos.mul(vec3(1, 1, 0)));
        const rotPhase = xyLen.mul(4.27).sub(time.mul(0.1));
        const uvAxis = vec3(0, 0, 1);
        const uvRot = rayPos.mul(rotateAxis(uvAxis, rotPhase));
        const uv = uvRot.mul(this.uniforms.textureRepeat);

        const noiseDeep = texture(this.resources.items.noiseDeepTexture, uv);

        const bandMin = bandWidth.negate();
        const bandEnds = vec3(bandMin, 0.0, bandWidth);
        const dz = sub(bandEnds, vec3(rayPos.z));
        const zQuad = dz.mul(dz).div(bandWidth);
        const zBand = max(bandWidth.sub(zQuad).div(bandWidth), 0.0);

        const noiseAmp3 = noiseDeep.mul(zBand);
        const noiseAmpLen = lengthSqrt(noiseAmp3);

        const uvForNormal = uv.mul(1.002);
        const noiseNormal = texture(
          this.resources.items.noiseDeepTexture,
          uvForNormal
        ).mul(zBand);

        const noiseNormalLen = lengthSqrt(noiseNormal);

        const rampInput = xyLen
          .add(noiseAmpLen.sub(0.78).mul(1.5))
          .add(noiseAmpLen.sub(noiseNormalLen).mul(19.75));

        const rampA = vec4(this.uniforms.rampCol1, this.uniforms.rampPos1);
        const rampB = vec4(this.uniforms.rampCol2, this.uniforms.rampPos2);
        const rampC = vec4(this.uniforms.rampCol3, this.uniforms.rampPos3);

        const baseCol = ColorRamp3_BSpline(rampInput.x, rampA, rampB, rampC);
        const diskMask = smoothRange(xyLen, outerRadius, 0.0, 0.0, 1.0);
        const hotInnerMask = smoothRange(
          xyLen,
          originRadius.mul(1.02),
          originRadius.mul(1.62),
          1.0,
          0.0
        ).mul(diskMask);
        const cyanRimMask = smoothRange(
          xyLen,
          originRadius.mul(0.92),
          originRadius.mul(1.24),
          1.0,
          0.0
        );
        const outerWarmMask = smoothRange(
          xyLen,
          outerRadius.mul(0.46),
          outerRadius,
          0.0,
          1.0
        ).mul(diskMask);
        const streakMask = smoothRange(noiseAmpLen, 0.32, 0.82, 0.0, 1.0);
        const hotWhite = vec3(1.0, 0.9, 1.0).mul(hotInnerMask.mul(0.72));
        const cyanRim = vec3(0.0, 0.68, 1.0).mul(cyanRimMask.mul(0.58));
        const warmAccent = vec3(1.0, 0.24, 0.08).mul(
          outerWarmMask.mul(streakMask).mul(0.92)
        );
        const pinkAccent = vec3(1.0, 0.18, 0.62).mul(
          outerWarmMask.mul(streakMask).mul(0.36)
        );

        const emissiveCol = baseCol
          .add(hotWhite)
          .add(cyanRim)
          .add(warmAccent)
          .add(pinkAccent)
          .mul(this.uniforms.rampEmission)
          .add(this.uniforms.emissionColor);

        const rLenNow = lengthSqrt(rayPos);
        const insideCore = rLenNow.lessThan(originRadius);
        const shadedCol = mix(emissiveCol, vec3(0), insideCore);

        const zAbs = abs(rayPos.z);
        const aNoise = noiseAmpLen.sub(0.75).mul(-0.6);
        const aPre = zAbs.add(aNoise);
        const aRadial = smoothRange(xyLen, outerRadius, 0.0, 0.0, 1.0);
        const aBand = smoothRange(aPre, bandWidth, 0, 0, aRadial);
        const alphaLocal = mix(aBand, 1.0, insideCore);

        const oneMinusA = alphaAcc.oneMinus();
        const weight = oneMinusA.mul(vecToFac(alphaLocal));
        const newColor = mix(colorAcc, shadedCol, weight);
        const newAlpha = mix(alphaAcc, 1.0, vecToFac(alphaLocal));

        const coreColor = mix(newColor, vec3(0), insideCore);
        const coreAlpha = mix(newAlpha, 1.0, insideCore);

        rayPos.addAssign(advance);
        rayDir.assign(steeredDir);
        colorAcc.assign(coreColor);
        alphaAcc.assign(coreAlpha);
      });

      return srgbToLinear(colorAcc);
    })();

    material.emissiveNode = material.colorNode;

    const mesh = new THREE.Mesh(geometry, material);
    this.container.add(mesh);
  }

  // ------------------------------------
  // UPDATE LOOP
  // ------------------------------------
  update() {
    // Add rotation or animation if needed
    // this.container.rotation.y += 0.1 * this.time.delta
  }
  
  postInit() { }
  
  // ─────────────────────────────────────────
  // REQUIRED LIFECYCLE METHODS
  // ─────────────────────────────────────────

  animationPipeline() {
    // Optional — runs before update()
  }

  destroy() {
    // Clean up THREE memory if needed
    this.container?.removeFromParent();
  }

  // ------------------------------------
  // RESIZE
  // ------------------------------------
  resize() {
    // No scale changes - keep original size
  }

  // ------------------------------------
  // DEBUG GUI
  // ------------------------------------
  _setDebug() {
    if (!this.debug.active) return;

    const folder = this.world.debugFolder.addFolder({
      title: "Black Hole",
      expanded: true,
    });

    folder.addBinding(this.uniforms.iterations, "value", {
      label: "Iterations",
    });
    folder.addBinding(this.uniforms.stepSize, "value", { label: "Step Size" });
    folder.addBinding(this.uniforms.noiseFactor, "value", {
      label: "Noise Factor",
      min: 0,
      max: 0.1,
      step: 0.0001,
    });
    folder.addBinding(this.uniforms.power, "value", { label: "Power" });
    folder.addBinding(this.uniforms.originRadius, "value", {
      label: "Inner Radius",
      min: 0.0,
      max: 1.0,
    });
    folder.addBinding(this.uniforms.outerRadius, "value", {
      label: "Outer Radius",
      min: 1.0,
      max: 3.0,
    });
    folder.addBinding(this.uniforms.width, "value", {
      label: "Ring Width",
      min: 0.0,
      max: 0.5,
    });
    folder.addBinding(this.uniforms.textureRepeat, "value", {
      label: "Texture Repeat",
      min: 0.1,
      max: 5.0,
    });

    folder.addBinding(this.uniforms.rampCol1, "value", {
      label: "Ramp Col 1",
      color: { type: "float" },
    });
    folder.addBinding(this.uniforms.rampPos1, "value", { label: "Ramp Pos 1" });
    folder.addBinding(this.uniforms.rampCol2, "value", {
      label: "Ramp Col 2",
      color: { type: "float" },
    });
    folder.addBinding(this.uniforms.rampPos2, "value", { label: "Ramp Pos 2" });
    folder.addBinding(this.uniforms.rampCol3, "value", {
      label: "Ramp Col 3",
      color: { type: "float" },
    });
    folder.addBinding(this.uniforms.rampPos3, "value", { label: "Ramp Pos 3" });

    folder.addBinding(this.uniforms.rampEmission, "value", {
      label: "Ramp Emission",
    });
    folder.addBinding(this.uniforms.emissionColor, "value", {
      label: "Emission Color",
      color: { type: "float" },
    });
  }
}
