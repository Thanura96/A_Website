import { useEffect, useRef } from "react";
import handImage from "../assets/hand_1.png";
import SoulGrid from "./SoulGrid";
import Arc from "./Arc";

/* =========================================
   1) Small helper: remove near-black pixels
   ========================================= */
function removeNearBlackPixels(imageData, threshold = 25) {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    if (r < threshold && g < threshold && b < threshold) d[i + 3] = 0;
  }
  return imageData;
}

/* =========================================
   2) HUD overlay
   - Top line (already)
   - Left vertical + left long horizontal (your red marks)
   - Right vertical + right short horizontal (your red marks)
   ========================================= */
function SoulSparkHudOverlay() {
  /* ==========================
     TOP line (your existing)
     ========================== */
  const TOP_LINE_LEFT_INSET = "clamp(52px, 14vw, 260px)";
  const TOP_LINE_RIGHT_INSET = "clamp(58px, 11vw, 290px)";
  const TOP_LINE_Y = "clamp(10px, 3.2vh, 38px)";

  /* ==========================
     🔧 Tune guide positions (PCT)
     These match your marked image layout.
     ========================== */

  // LEFT vertical line (under left text block, goes downward)
  const LEFT_V_PCT_X = 0.15;
  const LEFT_V_PCT_TOP = 0.3;
  const LEFT_V_PCT_H = 0.3;

  // LEFT long horizontal line (along arm, from left vertical line to right)
  const LEFT_H_PCT_Y = 0.77;
  const LEFT_H_PCT_W = 0.40; // % of img-w
  const LEFT_STUB_W_PCT = 0.10; // was 0.16 (shorter)

  // RIGHT vertical line (next to right text, goes downward)
  const RIGHT_V_PCT_X = 0.77;
  const RIGHT_V_PCT_TOP = 0.33;
  const RIGHT_V_PCT_H = 0.20;

  // RIGHT short horizontal line (across forearm)
  const RIGHT_H_PCT_Y = 0.18;
  const RIGHT_H_PCT_W = 0.18; // % of img-w (extends LEFT from the right vertical)
  const RIGHT_STUB_W_PCT = 0.04; // was 0.07 (shorter)

  /* ==========================
     Convert PCT -> CSS calc() using image vars
     ========================== */
  const LEFT_V_X = `calc(var(--img-x, 0px) + (var(--img-w, 0px) * ${LEFT_V_PCT_X}))`;
  const LEFT_V_TOP = `calc(var(--img-y, 0px) + (var(--img-h, 0px) * ${LEFT_V_PCT_TOP}))`;
  const LEFT_V_H = `calc(var(--img-h, 0px) * ${LEFT_V_PCT_H})`;

  const LEFT_H_Y = `calc(var(--img-y, 0px) + (var(--img-h, 0px) * ${LEFT_H_PCT_Y}))`;
  const LEFT_H_W = `calc(var(--img-w, 0px) * ${LEFT_H_PCT_W})`;

  const RIGHT_V_X = `calc(var(--img-x, 0px) + (var(--img-w, 0px) * ${RIGHT_V_PCT_X}))`;
  const RIGHT_V_TOP = `calc(var(--img-y, 0px) + (var(--img-h, 0px) * ${RIGHT_V_PCT_TOP}))`;
  const RIGHT_V_H = `calc(var(--img-h, 0px) * ${RIGHT_V_PCT_H})`;

  const RIGHT_H_Y = `calc(var(--img-y, 0px) + (var(--img-h, 0px) * ${RIGHT_H_PCT_Y}))`;
  const RIGHT_H_W = `calc(var(--img-w, 0px) * ${RIGHT_H_PCT_W})`;
  const RIGHT_H_LEFT = `calc(${RIGHT_V_X} - ${RIGHT_H_W})`; // extend left from right vertical

  /* ==========================
     Animation tuning
     ========================== */
  const CURRENT_SPEED = "2.0s";
  const CURRENT_TRAIL = "clamp(120px, 15vw, 220px)";
  const EDGE_FADE = "clamp(40px, 6vw, 120px)";

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <style>{`
        @keyframes runX {
          0%   { transform: translateX(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes runY {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        @keyframes shimmer {
          0%   { background-position: -140% 0; opacity: 0.10; }
          30%  { opacity: 0.22; }
          60%  { opacity: 0.14; }
          100% { background-position: 140% 0; opacity: 0.10; }
        }

        .hud-line{
          position:absolute;
          pointer-events:none;
          --speed:${CURRENT_SPEED};
          --trail:${CURRENT_TRAIL};
          --edge:${EDGE_FADE};
          overflow:hidden;
          opacity: calc(var(--img-ready, 0) * 0.92);
        }

        .hud-line.h{ height:1px; }
        .hud-line.v{ width:1px; }

        /* edge fade - horizontal */
        .hud-line.h{
          -webkit-mask-image: linear-gradient(90deg,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,1) var(--edge),
            rgba(0,0,0,1) calc(100% - var(--edge)),
            rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(90deg,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,1) var(--edge),
            rgba(0,0,0,1) calc(100% - var(--edge)),
            rgba(0,0,0,0) 100%);
        }

        /* edge fade - vertical */
        .hud-line.v{
          -webkit-mask-image: linear-gradient(0deg,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,1) var(--edge),
            rgba(0,0,0,1) calc(100% - var(--edge)),
            rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(0deg,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,1) var(--edge),
            rgba(0,0,0,1) calc(100% - var(--edge)),
            rgba(0,0,0,0) 100%);
        }

        .hud-line .base{
          position:absolute;
          inset:0;
          background: rgba(255,255,255,0.62);
        }

        .hud-line .sheen{
          position:absolute;
          inset:0;
          background-image: linear-gradient(90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.45) 50%,
            rgba(255,255,255,0) 100%);
          background-size: 220% 100%;
          animation: shimmer 3.2s linear infinite;
          mix-blend-mode: screen;
          opacity: 0.18;
        }

        /* runner base */
        .hud-line .current{
          position:absolute;
          inset:0;
          opacity:0;
          will-change: transform;
        }

        /* horizontal runner */
        .hud-line.h .current{
          transform: translateX(-100%);
          animation: runX var(--speed) linear infinite;
        }
        .hud-line.h .current::before{
          content:"";
          position:absolute;
          left:0;
          top:0;
          height:1px;
          width:100%;
          background: linear-gradient(90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0) calc(0% + var(--edge)),
            rgba(255,255,255,0.32) calc(30% + var(--edge)),
            rgba(255,255,255,1) 50%,
            rgba(255,255,255,0.32) calc(70% - var(--edge)),
            rgba(255,255,255,0) calc(100% - var(--edge)),
            rgba(255,255,255,0) 100%);
        }

        /* vertical runner */
        .hud-line.v .current{
          transform: translateY(-100%);
          animation: runY var(--speed) linear infinite;
        }
        .hud-line.v .current::before{
          content:"";
          position:absolute;
          left:0;
          top:0;
          width:1px;
          height:100%;
          background: linear-gradient(0deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0) calc(0% + var(--edge)),
            rgba(255,255,255,0.32) calc(10% + var(--edge)),
            rgba(255,255,255,1) 50%,
            rgba(255,255,255,0.32) calc(90% - var(--edge)),
            rgba(255,255,255,0) calc(100% - var(--edge)),
            rgba(255,255,255,0) 100%);
        }

        .hud-line .current.c2{
          animation-delay: calc(var(--speed) * 0.55);
          animation-duration: calc(var(--speed) * 1.12);
        }
        .hud-line .current.c3{
          animation-delay: calc(var(--speed) * 0.20);
          animation-duration: calc(var(--speed) * 0.92);
        }
      `}</style>

      {/* ✅ TOP horizontal line */}
      <div
        className="hud-line h"
        style={{ top: TOP_LINE_Y, left: TOP_LINE_LEFT_INSET, right: TOP_LINE_RIGHT_INSET }}
      >
        <div className="base" />
        {/* <div className="sheen" /> */}
        <div className="current c1" />
        {/* <div className="current c2" /> */}
      </div>

      {/* ✅ LEFT vertical line */}
      <div className="hud-line v" style={{ left: LEFT_V_X, top: LEFT_V_TOP, height: LEFT_V_H }}>
        <div className="base" />
        <div className="current c1" />
        <div className="current c2" />
      </div>

      {/* ✅ RIGHT vertical line */}
      <div className="hud-line v" style={{ left: RIGHT_V_X, top: RIGHT_V_TOP, height: RIGHT_V_H }}>
        <div className="base" />
        <div className="current c1" />
        <div className="current c2" />
      </div>
    </div>
  );
}

export default function ImageGlitch() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  const imageRef = useRef(null);
  const processedRef = useRef(null);
  const animationRef = useRef(null);

  const lastRectRef = useRef({ x: -1, y: -1, w: -1, h: -1 });

  const setImageVars = (x, y, w, h) => {
    const el = sceneRef.current;
    if (!el) return;

    const last = lastRectRef.current;
    const same =
      Math.abs(last.x - x) < 0.5 &&
      Math.abs(last.y - y) < 0.5 &&
      Math.abs(last.w - w) < 0.5 &&
      Math.abs(last.h - h) < 0.5;

    if (same) return;

    lastRectRef.current = { x, y, w, h };

    el.style.setProperty("--img-x", `${x}px`);
    el.style.setProperty("--img-y", `${y}px`);
    el.style.setProperty("--img-w", `${w}px`);
    el.style.setProperty("--img-h", `${h}px`);
    el.style.setProperty("--img-ready", `1`);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = handImage;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
    };

    img.onload = () => {
      imageRef.current = img;

      // ✅ Preprocess ONCE
      const off = document.createElement("canvas");
      off.width = img.width;
      off.height = img.height;
      const offCtx = off.getContext("2d");
      offCtx.drawImage(img, 0, 0);

      const imageData = offCtx.getImageData(0, 0, off.width, off.height);
      offCtx.putImageData(removeNearBlackPixels(imageData, 25), 0, 0);
      processedRef.current = off;

      updateCanvasSize();
      drawScene();
    };

    const drawBaseImage = () => {
      const base = processedRef.current || imageRef.current;
      if (!base) return;

      const cw = canvas.width;
      const ch = canvas.height;

      const screenAspectRatio = cw / ch;
      const imageAspectRatio = base.width / base.height;

      let scale;
      if (screenAspectRatio > imageAspectRatio) {
        scale = cw / base.width;
      } else {
        scale = Math.min(cw / base.width, ch / base.height);
      }

      const w = base.width * scale;
      const h = base.height * scale;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;

      setImageVars(x, y, w, h);
      ctx.drawImage(base, x, y, w, h);
    };

    const drawScene = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBaseImage();
    };

    const scheduleDraw = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      animationRef.current = requestAnimationFrame(() => {
        animationRef.current = null;
        updateCanvasSize();
        drawScene();
      });
    };

    window.addEventListener("resize", scheduleDraw, { passive: true });

    return () => {
      window.removeEventListener("resize", scheduleDraw);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  /* ==========================
     Text blocks positioning
     ========================== */
  const LEFT_TEXT_X =
    "calc(var(--img-x, 0px) + (var(--img-w, 0px) * var(--glitch-left-x, 0.105)))";
  const LEFT_TEXT_Y =
    "calc(var(--img-y, 0px) + (var(--img-h, 0px) * var(--glitch-left-y, 0.18)))";
  const LEFT_TEXT_W = "calc(var(--img-w, 0px) * var(--glitch-left-w, 0.34))";

  const RIGHT_TEXT_X =
    "calc(var(--img-x, 0px) + (var(--img-w, 0px) * var(--glitch-right-x, 0.72)))";
  const RIGHT_TEXT_Y =
    "calc(var(--img-y, 0px) + (var(--img-h, 0px) * var(--glitch-right-y, 0.53)))";
  const RIGHT_TEXT_W = "calc(var(--img-w, 0px) * var(--glitch-right-w, 0.22))";

  const TITLE_FS =
    "calc(var(--glitch-text-scale, 1) * clamp(9px, calc(var(--img-w, 0px) * 0.0104), 12px))";
  const META_FS =
    "calc(var(--glitch-text-scale, 1) * clamp(8px, calc(var(--img-w, 0px) * 0.0085), 10px))";
  const BLOCK_GAP =
    "calc(var(--glitch-text-scale, 1) * clamp(8px, calc(var(--img-w, 0px) * 0.010), 14px))";
  const META_GAP =
    "calc(var(--glitch-text-scale, 1) * clamp(2px, calc(var(--img-w, 0px) * 0.004), 6px))";

  return (
    <div
      ref={sceneRef}
      className="w-full h-full relative bg-black flex items-center justify-center glitch-root"
    >
      <style>{`
        .glitch-root {
          --glitch-text-scale: 1;
          --glitch-text-line: 1.2;
          --glitch-left-x: 0.105;
          --glitch-left-y: 0.18;
          --glitch-left-w: 0.34;
          --glitch-right-x: 0.72;
          --glitch-right-y: 0.53;
          --glitch-right-w: 0.22;
        }
        @media (max-width: 1200px) {
          .glitch-root { --glitch-text-scale: 0.95; }
        }
        @media (max-width: 992px) {
          .glitch-root { --glitch-text-scale: 0.9; }
        }
        @media (max-width: 768px) {
          .glitch-root { --glitch-text-scale: 0.85; }
        }
        @media (max-width: 560px) {
          .glitch-root { --glitch-text-scale: 0.8; }
        }
        @media (max-width: 420px) {
          .glitch-root { --glitch-text-scale: 0.75; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          filter: "contrast(1.1) brightness(1.05)",
          imageRendering: "crisp-edges",
          zIndex: 0,
        }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.2) 1px,
            transparent 1px,
            transparent 3px
          )`,
        }}
      />

      {/* ✅ HUD lines (top + left + right) */}
      <SoulSparkHudOverlay />
      <SoulGrid />
      <Arc />

      {/* ✅ LEFT TEXT BLOCK */}
      <div
        className="absolute z-30 text-white"
        style={{
          left: LEFT_TEXT_X,
          top: LEFT_TEXT_Y,
          width: LEFT_TEXT_W,
          opacity: "var(--img-ready, 0)",
        }}
      >
        <div
          style={{
            fontSize: TITLE_FS,
            letterSpacing: "0.02em",
            lineHeight: "var(--glitch-text-line, 1.2)",
          }}
        >
          IDENTIFYING SECOND SUBJECT
        </div>
        <div style={{ fontSize: META_FS, opacity: 0.75, marginTop: META_GAP }}>
          Join at 14:24, 10/10/2025
        </div>

        <div
          style={{
            marginTop: BLOCK_GAP,
            fontSize: TITLE_FS,
            letterSpacing: "0.02em",
            lineHeight: "var(--glitch-text-line, 1.2)",
          }}
        >
          Surveillance Analysis
        </div>
        <div style={{ fontSize: META_FS, opacity: 0.75, marginTop: META_GAP }}>
          Join at 14:24, 10/10/2025
        </div>

        <div
          style={{
            marginTop: BLOCK_GAP,
            fontSize: TITLE_FS,
            letterSpacing: "0.02em",
            lineHeight: "var(--glitch-text-line, 1.2)",
          }}
        >
          <span style={{ fontWeight: 700 }}>HAWKEYE ➜</span>{" "}
          Leash off. Gods-eye active. Good hunting.
        </div>
        <div style={{ fontSize: META_FS, opacity: 0.75, marginTop: META_GAP }}>
          Join at 14:24, 10/10/2025
        </div>
      </div>

      {/* ✅ RIGHT TEXT BLOCK */}
      <div
        className="absolute z-30 text-white"
        style={{
          left: RIGHT_TEXT_X,
          top: RIGHT_TEXT_Y,
          width: RIGHT_TEXT_W,
          opacity: "var(--img-ready, 0)",
        }}
      >
        <div
          style={{
            fontSize: TITLE_FS,
            letterSpacing: "0.02em",
            lineHeight: "var(--glitch-text-line, 1.2)",
          }}
        >
          what is dark matter made of?
        </div>
        <div style={{ fontSize: META_FS, opacity: 0.75, marginTop: META_GAP }}>
          Join at 14:24, 10/10/2025
        </div>

        <div
          style={{
            marginTop: BLOCK_GAP,
            fontSize: TITLE_FS,
            letterSpacing: "0.02em",
            lineHeight: "var(--glitch-text-line, 1.2)",
          }}
        >
          What hides in the universe&apos;s shadows?
        </div>
        <div style={{ fontSize: META_FS, opacity: 0.75, marginTop: META_GAP }}>
          Join at 14:24, 10/10/2025
        </div>

        <div
          style={{
            marginTop: BLOCK_GAP,
            fontSize: TITLE_FS,
            letterSpacing: "0.02em",
            lineHeight: "var(--glitch-text-line, 1.2)",
          }}
        >
          Are we alone in eternity&apos;s expanse?
        </div>
        <div style={{ fontSize: META_FS, opacity: 0.75, marginTop: META_GAP }}>
          Join at 14:24, 10/10/2025
        </div>
      </div>

      {/* ✅ SOUL title */}
      <div
        className="absolute z-30"
        style={{
          left: "calc(var(--img-x, 0px) + var(--img-w, 0px) * 0.28)",
          width: "calc(var(--img-w, 0px) * 0.82)",
          top: "calc(var(--img-y, 0px) + var(--img-h, 0px) * 0.64)",
          opacity: "var(--img-ready, 0)",
        }}
      >
        <h1
          className="font-yapari font-bold text-white uppercase"
          style={{
            fontSize: "calc(var(--img-w, 0px) * 0.10)",
            letterSpacing: "calc(var(--img-w, 0px) * 0.01)",
            lineHeight: 0.9,
            margin: 0,
            textAlign: "left",
            whiteSpace: "nowrap",
          }}
        >
          <span>S</span>
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <span style={{ color: "#E3E41B" }}>O</span>
            <span>U</span>
            <span
              className="font-code"
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: "clamp(2px, calc(var(--img-w, 0px) * 0.004), 8px)",
                fontSize: "clamp(10px, calc(var(--img-w, 0px) * 0.022), 24px)",
                fontWeight: 400,
                letterSpacing: "0.04em",
                lineHeight: 1,
                textTransform: "none",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              AGENTIC WARFARE
            </span>
          </span>
          <span>L</span>
        </h1>
      </div>
    </div>
  );
}
