"use client";

import React, { useEffect, useRef } from "react";

const clamp01 = (value) => Math.max(0, Math.min(1, value));

export default function HeroSmoke() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      console.warn("WebGL not supported in this browser/device.");
      return;
    }

    const vs = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_uv;

      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_mouse;
      uniform float u_mdown;
      uniform vec2  u_mvel;

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0 - 2.0*f);
        float a = hash(i + vec2(0.0,0.0));
        float b = hash(i + vec2(1.0,0.0));
        float c = hash(i + vec2(0.0,1.0));
        float d = hash(i + vec2(1.0,1.0));
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }

      float fbm(vec2 p){
        float v = 0.0;
        float a = 0.52;
        for(int i=0;i<6;i++){
          v += a * noise(p);
          p *= 2.02;
          a *= 0.54;
        }
        return v;
      }

      vec2 warp(vec2 p, float t){
        float n1 = fbm(p*1.12 + vec2(0.0, t*0.06));
        float n2 = fbm(p*1.12 + vec2(4.7, t*0.06));
        return vec2(n1, n2);
      }

      void main(){
        vec2 uv = v_uv;
        float aspect = u_res.x / u_res.y;

        vec2 p = vec2(uv.x * aspect, uv.y);
        float t = u_time;

        p.x += t * 0.14;

        vec2 w = warp(p*2.15, t);
        p += (w - 0.5) * 0.75;

        vec2 m  = vec2(u_mouse.x * aspect, u_mouse.y);
        vec2 mv = vec2(u_mvel.x * aspect, u_mvel.y);

        float md = length(p - m);
        float mi = exp(-md*md * 5.5);
        float speed = clamp(length(mv) * 8.0, 0.0, 1.0);

        p += mv * mi * (0.60 + 0.80*u_mdown);

        float press = mix(0.45, 1.0, u_mdown);
        p += (warp(p*3.15 + m*2.0 + mv*4.0, t) - 0.5)
             * (0.85 * mi * (0.60 + 1.70*speed) * press);

        float n = fbm(p*2.75 + vec2(0.0, t*0.14));
        float wisps = smoothstep(0.30, 0.95, n);

        float rightMask = pow(clamp(uv.x, 0.0, 1.0), 1.85);
        float yMask = exp(-pow((uv.y - 0.52) / 0.66, 2.0));

        float smoke = wisps * rightMask * yMask;
        smoke += mi * (0.30 + 0.60*u_mdown) * (0.60 + 1.20*speed);
        smoke = clamp(smoke * 1.25, 0.0, 1.0);

        vec2 lc = vec2(1.035, 0.50);
        float core = exp(-(
          (uv.x - lc.x)*(uv.x - lc.x) / 0.0028 +
          (uv.y - lc.y)*(uv.y - lc.y) / 0.060
        ));

        float halo = exp(-(
          (uv.x - 0.985)*(uv.x - 0.985) / 0.055 +
          (uv.y - 0.50 )*(uv.y - 0.50 ) / 0.220
        ));

        float beamY = 0.52 + 0.06*sin(t*0.45);
        float beamShape = exp(-pow((uv.y - beamY)/0.22, 2.0));
        float beamFall  = exp(-0.92 * (1.0 - uv.x));
        float beam      = beamShape * beamFall;

        float haze = exp(-1.70 * (1.0 - uv.x)) * exp(-pow((uv.y-0.52)/0.95, 2.0));

        float rightOnly = smoothstep(0.55, 1.0, uv.x);
        float light = (3.6*core + 1.55*halo + 1.05*beam + 0.72*haze) * rightOnly;

        vec3 col = vec3(0.0);
        col += vec3(0.01, 0.02, 0.05) * pow(uv.x, 4.2);

        vec3 smokeCol = vec3(0.16, 0.36, 1.02);
        vec3 lightCol = vec3(0.78, 0.88, 1.00);

        col += smokeCol * smoke * (1.05 + 1.35*halo + 1.05*beam);
        col += lightCol * light * 0.80;
        col += vec3(1.0) * core * 1.45 * rightOnly;
        col += vec3(0.90, 0.96, 1.0) * (smoke * (halo + beam)) * 0.90 * rightOnly;

        col = 1.0 - exp(-col * 1.18);
        col = pow(col, vec3(0.95));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type, src) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vsShader = compile(gl.VERTEX_SHADER, vs);
    const fsShader = compile(gl.FRAGMENT_SHADER, fs);
    if (!vsShader || !fsShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vsShader);
    gl.attachShader(program, fsShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vsShader);
      gl.deleteShader(fsShader);
      return;
    }
    gl.useProgram(program);
    gl.deleteShader(vsShader);
    gl.deleteShader(fsShader);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "a_pos");
    if (aPos !== -1) {
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    }

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uMdown = gl.getUniformLocation(program, "u_mdown");
    const uMvel = gl.getUniformLocation(program, "u_mvel");

    const mouse = {
      x: 0.78,
      y: 0.52,
      tx: 0.78,
      ty: 0.52,
      down: 0,
      vx: 0,
      vy: 0,
      px: 0.78,
      py: 0.52,
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, w, h);
      if (uRes) gl.uniform2f(uRes, w, h);
    };

    const setMouseTarget = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height;
      mouse.tx = clamp01(x);
      mouse.ty = clamp01(y);
    };

    const onPointerDown = (e) => {
      mouse.down = 1;
      setMouseTarget(e.clientX, e.clientY);
    };
    const onPointerMove = (e) => setMouseTarget(e.clientX, e.clientY);
    const onPointerUp = () => {
      mouse.down = 0;
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    resize();

    const t0 = performance.now();
    let lastFrame = performance.now();
    let rafId = 0;

    const frame = (now) => {
      const t = (now - t0) * 0.001;
      const dt = Math.max(1 / 240, (now - lastFrame) * 0.001);
      lastFrame = now;

      const follow = 1.0 - Math.exp(-dt * 16.0);
      mouse.x += (mouse.tx - mouse.x) * follow;
      mouse.y += (mouse.ty - mouse.y) * follow;

      const vx = (mouse.x - mouse.px) / dt;
      const vy = (mouse.y - mouse.py) / dt;
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      const vSmooth = 1.0 - Math.exp(-dt * 10.0);
      mouse.vx += (vx - mouse.vx) * vSmooth;
      mouse.vy += (vy - mouse.vy) * vSmooth;

      const maxV = 3.0;
      mouse.vx = Math.max(-maxV, Math.min(maxV, mouse.vx));
      mouse.vy = Math.max(-maxV, Math.min(maxV, mouse.vy));

      if (uTime) gl.uniform1f(uTime, t);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uMdown) gl.uniform1f(uMdown, mouse.down);
      if (uMvel) gl.uniform2f(uMvel, mouse.vx * 0.0012, mouse.vy * 0.0012);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", resize);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 top-0 h-[80vh] pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <div
        className="h-full w-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 78%)",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 78%)",
          }}
        >
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
            style={{ mixBlendMode: "screen" }}
          />
        </div>
      </div>
    </div>
  );
}
