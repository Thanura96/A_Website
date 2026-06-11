"use client";

import { useEffect, useRef, useState } from "react";
import blackholeImage from "../assets/blackhole.png";
import accretionVideo from "../assets/BH_AccretionDisk_Sim_Stationary_WebSize.mp4";

export default function BlackHoleCanvas() {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {});
    };

    playVideo();
    video.addEventListener("loadeddata", playVideo);
    document.addEventListener("visibilitychange", playVideo);
    window.addEventListener("focus", playVideo);
    window.addEventListener("pageshow", playVideo);

    return () => {
      video.removeEventListener("loadeddata", playVideo);
      document.removeEventListener("visibilitychange", playVideo);
      window.removeEventListener("focus", playVideo);
      window.removeEventListener("pageshow", playVideo);
    };
  }, []);

  return (
    <div
      className="
        pointer-events-none
        relative
        z-0
        h-[100dvh]
        min-h-[620px]
        w-full
        overflow-hidden
      "
      style={{
        WebkitTapHighlightColor: "transparent",
        background:
          "radial-gradient(ellipse at 50% 35%, rgba(12, 20, 65, 0.65), rgba(5, 6, 22, 0.18) 45%, rgba(0, 0, 0, 0) 72%), linear-gradient(180deg, #03040e 0%, #04051a 48%, #000000 100%)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="blackhole-lower-field" aria-hidden="true" />

      <div className="blackhole-asset-stage">
        <img
          src={blackholeImage}
          alt=""
          draggable="false"
          className="blackhole-still select-none"
        />
        <div
          className={`blackhole-motion-layer ${
            isVideoReady ? "is-ready" : ""
          }`}
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            src={accretionVideo}
            className="blackhole-video"
            autoPlay
            muted
            loop
            playsInline
            poster={blackholeImage}
            preload="auto"
            onCanPlay={() => setIsVideoReady(true)}
          />
        </div>
        <div className="blackhole-color-bridge" aria-hidden="true" />
        <div className="blackhole-glow-core" aria-hidden="true" />
        <div className="blackhole-glow-ambient" aria-hidden="true" />
      </div>

      <div className="blackhole-lower-streaks" aria-hidden="true" />
      <div className="blackhole-lower-haze" aria-hidden="true" />

      <style>{`
        .blackhole-asset-stage {
          position: absolute;
          left: 50%;
          top: 43%;
          width: min(112vw, 1900px);
          aspect-ratio: 1248 / 442;
          transform: translate(-50%, -50%);
          filter: saturate(1.12) contrast(1.04);
          -webkit-mask-image: radial-gradient(
            ellipse 72% 64% at 50% 50%,
            #000 0%,
            #000 56%,
            rgba(0, 0, 0, 0.8) 68%,
            rgba(0, 0, 0, 0.5) 79%,
            rgba(0, 0, 0, 0.22) 89%,
            rgba(0, 0, 0, 0.06) 96%,
            transparent 100%
          );
          mask-image: radial-gradient(
            ellipse 72% 64% at 50% 50%,
            #000 0%,
            #000 56%,
            rgba(0, 0, 0, 0.8) 68%,
            rgba(0, 0, 0, 0.5) 79%,
            rgba(0, 0, 0, 0.22) 89%,
            rgba(0, 0, 0, 0.06) 96%,
            transparent 100%
          );
        }

        .blackhole-still,
        .blackhole-motion-layer,
        .blackhole-video,
        .blackhole-color-bridge,
        .blackhole-glow-core,
        .blackhole-glow-ambient {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .blackhole-still {
          z-index: 2;
          object-fit: contain;
          opacity: 0.98;
          mix-blend-mode: screen;
          filter: saturate(1.12) brightness(1.04) contrast(1.06);
        }

        .blackhole-motion-layer {
          z-index: 3;
          opacity: 0;
          overflow: hidden;
          transform-origin: 50% 50%;
          transform: translateZ(0);
          will-change: opacity;
          transition: opacity 900ms ease;
          mix-blend-mode: screen;
          -webkit-mask-image:
            radial-gradient(ellipse 64% 60% at 50% 48%,
              #000 0%,
              #000 30%,
              rgba(0, 0, 0, 0.78) 46%,
              rgba(0, 0, 0, 0.42) 60%,
              rgba(0, 0, 0, 0.16) 74%,
              rgba(0, 0, 0, 0.05) 88%,
              transparent 100%),
            linear-gradient(180deg,
              transparent 0%,
              rgba(0, 0, 0, 0.6) 12%,
              #000 26%,
              #000 60%,
              rgba(0, 0, 0, 0.72) 72%,
              rgba(0, 0, 0, 0.46) 82%,
              rgba(0, 0, 0, 0.2) 90%,
              rgba(0, 0, 0, 0.07) 96%,
              transparent 100%);
          -webkit-mask-composite: source-in;
          mask-image:
            radial-gradient(ellipse 64% 60% at 50% 48%,
              #000 0%,
              #000 30%,
              rgba(0, 0, 0, 0.78) 46%,
              rgba(0, 0, 0, 0.42) 60%,
              rgba(0, 0, 0, 0.16) 74%,
              rgba(0, 0, 0, 0.05) 88%,
              transparent 100%),
            linear-gradient(180deg,
              transparent 0%,
              rgba(0, 0, 0, 0.6) 12%,
              #000 26%,
              #000 60%,
              rgba(0, 0, 0, 0.72) 72%,
              rgba(0, 0, 0, 0.46) 82%,
              rgba(0, 0, 0, 0.2) 90%,
              rgba(0, 0, 0, 0.07) 96%,
              transparent 100%);
          mask-composite: intersect;
        }

        .blackhole-motion-layer.is-ready {
          opacity: 0.7;
        }

        .blackhole-video {
          object-fit: contain;
          object-position: center center;
          opacity: 1;
          filter: hue-rotate(315deg) saturate(1.38) contrast(1.16) brightness(1.10) blur(0.20px);
          /* Shift the video's red arc down-right so it lands on the image's
             blue arch and the two physically mix via screen blending */
          transform: translate(2.5%, 7%) scale(1.015) translateZ(0);
        }

        /* Fuses the lower region into ONE continuous reflection crescent:
           a vertical hue ramp (pink -> purple -> blue) whose overlapping
           ellipses fill the dark gap between the pink ring and the blue
           arch, with a white-hot core at the fusion point. */
        .blackhole-color-bridge {
          z-index: 4;
          mix-blend-mode: screen;
          background:
            radial-gradient(ellipse 15% 9% at 50% 73%,
              rgba(255, 255, 255, 0.32) 0%,
              rgba(235, 225, 255, 0.14) 48%,
              transparent 75%),
            radial-gradient(ellipse 30% 15% at 50% 66%,
              rgba(255, 92, 202, 0.42) 0%,
              rgba(255, 92, 202, 0.18) 46%,
              transparent 75%),
            radial-gradient(ellipse 27% 17% at 50% 74%,
              rgba(196, 130, 255, 0.46) 0%,
              rgba(196, 130, 255, 0.20) 50%,
              transparent 78%),
            radial-gradient(ellipse 28% 17% at 50% 83%,
              rgba(110, 205, 255, 0.20) 0%,
              rgba(110, 205, 255, 0.08) 50%,
              transparent 76%),
            linear-gradient(180deg,
              transparent 54%,
              rgba(255, 130, 220, 0.08) 63%,
              rgba(200, 145, 255, 0.14) 73%,
              rgba(140, 185, 255, 0.06) 85%,
              rgba(110, 175, 255, 0.02) 94%,
              transparent 100%);
          filter: blur(26px);
          opacity: 1;
          transform: translateZ(0);
          will-change: opacity;
          -webkit-mask-image: radial-gradient(
            ellipse 38% 50% at 50% 75%,
            #000 0%,
            rgba(0, 0, 0, 0.75) 54%,
            rgba(0, 0, 0, 0.3) 78%,
            transparent 98%
          );
          mask-image: radial-gradient(
            ellipse 38% 50% at 50% 75%,
            #000 0%,
            rgba(0, 0, 0, 0.75) 54%,
            rgba(0, 0, 0, 0.3) 78%,
            transparent 98%
          );
          animation: blackholeBridgePulse 11s ease-in-out infinite;
        }

        .blackhole-glow-core {
          z-index: 4;
          background:
            radial-gradient(ellipse 30% 42% at 50% 46%,
              rgba(255, 255, 255, 0.18) 0%,
              rgba(120, 220, 255, 0.35) 22%,
              rgba(120, 220, 255, 0.12) 48%,
              transparent 70%),
            radial-gradient(ellipse 56% 24% at 50% 50%,
              rgba(120, 220, 255, 0.16) 0%,
              rgba(255, 130, 210, 0.10) 42%,
              transparent 72%);
          mix-blend-mode: screen;
          filter: blur(26px);
          opacity: 0.6;
          transform: translateZ(0);
          will-change: transform, opacity;
          animation: blackholeGlowFloat 9s ease-in-out infinite;
        }

        .blackhole-glow-ambient {
          z-index: 4;
          background:
            radial-gradient(ellipse 86% 78% at 50% 50%,
              transparent 0%,
              transparent 44%,
              rgba(180, 120, 255, 0.18) 66%,
              rgba(255, 92, 202, 0.10) 80%,
              transparent 96%),
            linear-gradient(90deg,
              transparent 0%,
              rgba(255, 82, 160, 0.08) 30%,
              rgba(120, 200, 255, 0.07) 50%,
              rgba(180, 120, 255, 0.08) 70%,
              transparent 100%);
          mix-blend-mode: screen;
          filter: blur(34px);
          opacity: 0.5;
          transform: translateZ(0);
          will-change: transform, opacity;
          animation: blackholeAmbientFloat 14s ease-in-out infinite;
        }

        .blackhole-asset-stage::after {
          content: "";
          position: absolute;
          inset: -2px;
          z-index: 5;
          pointer-events: none;
          background:
            radial-gradient(ellipse 24% 16% at 50% 87%,
              rgba(2, 4, 12, 0.3) 0%,
              rgba(2, 4, 12, 0.14) 48%,
              transparent 74%),
            linear-gradient(180deg,
              rgba(0, 0, 0, 0.24) 0%,
              rgba(0, 0, 0, 0.08) 8%,
              rgba(0, 0, 0, 0) 22%,
              rgba(0, 0, 0, 0) 84%,
              rgba(0, 0, 0, 0.1) 100%),
            linear-gradient(90deg,
              rgba(0, 0, 0, 0.18) 0%,
              rgba(0, 0, 0, 0) 14%,
              rgba(0, 0, 0, 0) 86%,
              rgba(0, 0, 0, 0.18) 100%);
        }

        /* ============================================================
           Lower arc volumetric field — lives OUTSIDE .blackhole-asset-stage
           so it escapes the stage mask and can extend far beyond the
           visible animation (~150-200% of the arc footprint).
           ============================================================ */
        .blackhole-lower-field {
          position: absolute;
          left: 50%;
          top: 60%;
          width: min(170vw, 2700px);
          height: min(78vh, 880px);
          transform: translate(-50%, -50%) translateZ(0);
          pointer-events: none;
          mix-blend-mode: screen;
          -webkit-mask-image: radial-gradient(
            ellipse 50% 50% at 50% 50%,
            #000 0%,
            rgba(0, 0, 0, 0.85) 40%,
            rgba(0, 0, 0, 0.5) 62%,
            rgba(0, 0, 0, 0.18) 82%,
            transparent 98%
          );
          mask-image: radial-gradient(
            ellipse 50% 50% at 50% 50%,
            #000 0%,
            rgba(0, 0, 0, 0.85) 40%,
            rgba(0, 0, 0, 0.5) 62%,
            rgba(0, 0, 0, 0.18) 82%,
            transparent 98%
          );
        }

        /* Main volumetric scatter: cyan core -> magenta falloff -> transparent */
        .blackhole-lower-field::before {
          content: "";
          position: absolute;
          inset: -10%;
          background:
            radial-gradient(ellipse 30% 26% at 50% 38%,
              rgba(120, 220, 255, 0.26) 0%,
              rgba(120, 220, 255, 0.12) 30%,
              rgba(255, 92, 202, 0.14) 54%,
              rgba(180, 120, 255, 0.07) 72%,
              transparent 90%),
            radial-gradient(ellipse 52% 34% at 50% 46%,
              rgba(120, 220, 255, 0.1) 0%,
              rgba(255, 92, 202, 0.07) 48%,
              transparent 78%);
          filter: blur(140px);
          transform: translateZ(0);
          will-change: transform, opacity;
          animation: blackholeLowerBreathe 10s ease-in-out infinite;
        }

        /* Atmospheric energy fog, asymmetric so it reads as nebular haze */
        .blackhole-lower-field::after {
          content: "";
          position: absolute;
          inset: -8%;
          background:
            radial-gradient(ellipse 50% 36% at 41% 50%,
              rgba(120, 220, 255, 0.1) 0%,
              transparent 70%),
            radial-gradient(ellipse 44% 32% at 61% 44%,
              rgba(255, 92, 202, 0.09) 0%,
              transparent 72%),
            radial-gradient(ellipse 70% 52% at 50% 52%,
              rgba(180, 120, 255, 0.06) 0%,
              transparent 82%);
          filter: blur(120px);
          transform: translateZ(0);
          will-change: transform;
          animation: blackholeFogDrift 18s ease-in-out infinite alternate;
        }

        /* Sparse particles + elongated energy streaks dissolving outward */
        .blackhole-lower-streaks {
          position: absolute;
          left: 50%;
          top: 58%;
          width: min(120vw, 1900px);
          height: min(38vh, 420px);
          transform: translate(-50%, -50%) translateZ(0);
          pointer-events: none;
          mix-blend-mode: screen;
          background:
            radial-gradient(2px 2px at 21% 38%, rgba(170, 235, 255, 0.85) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 34% 62%, rgba(255, 170, 230, 0.7) 0%, transparent 100%),
            radial-gradient(2.5px 2.5px at 47% 30%, rgba(200, 240, 255, 0.8) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 58% 56%, rgba(170, 235, 255, 0.65) 0%, transparent 100%),
            radial-gradient(2px 2px at 69% 42%, rgba(255, 170, 230, 0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 79% 64%, rgba(200, 240, 255, 0.55) 0%, transparent 100%),
            radial-gradient(ellipse 130px 5px at 33% 48%, rgba(120, 220, 255, 0.22) 0%, transparent 70%),
            radial-gradient(ellipse 170px 6px at 64% 52%, rgba(255, 92, 202, 0.16) 0%, transparent 70%),
            radial-gradient(ellipse 110px 4px at 50% 60%, rgba(180, 200, 255, 0.14) 0%, transparent 70%);
          -webkit-mask-image: radial-gradient(
            ellipse 50% 50% at 50% 50%,
            #000 0%,
            rgba(0, 0, 0, 0.6) 55%,
            rgba(0, 0, 0, 0.2) 80%,
            transparent 100%
          );
          mask-image: radial-gradient(
            ellipse 50% 50% at 50% 50%,
            #000 0%,
            rgba(0, 0, 0, 0.6) 55%,
            rgba(0, 0, 0, 0.2) 80%,
            transparent 100%
          );
          will-change: transform, opacity;
          animation: blackholeStreakDrift 22s ease-in-out infinite;
        }

        /* Heat-haze shimmer: blurred low-opacity bands drifting laterally.
           Cheaper than SVG displacement and stays on the compositor. */
        .blackhole-lower-haze {
          position: absolute;
          left: 50%;
          top: 61%;
          width: min(140vw, 2100px);
          height: min(26vh, 300px);
          transform: translate(-50%, -50%) translateZ(0);
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.12;
          background:
            linear-gradient(94deg,
              transparent 0%,
              rgba(120, 220, 255, 0.5) 28%,
              transparent 42%,
              rgba(255, 92, 202, 0.4) 58%,
              transparent 74%,
              rgba(160, 200, 255, 0.45) 88%,
              transparent 100%);
          filter: blur(36px);
          -webkit-mask-image: radial-gradient(
            ellipse 48% 50% at 50% 50%,
            #000 0%,
            rgba(0, 0, 0, 0.5) 60%,
            transparent 95%
          );
          mask-image: radial-gradient(
            ellipse 48% 50% at 50% 50%,
            #000 0%,
            rgba(0, 0, 0, 0.5) 60%,
            transparent 95%
          );
          will-change: transform;
          animation: blackholeHazeShimmer 13s ease-in-out infinite alternate;
        }

        @keyframes blackholeLowerBreathe {
          0%, 100% {
            opacity: 0.8;
            transform: translateZ(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateZ(0) scale(1.05);
          }
        }

        @keyframes blackholeFogDrift {
          0% {
            transform: translate3d(-1.6%, 0.6%, 0) scale(1);
          }
          100% {
            transform: translate3d(1.6%, -0.6%, 0) scale(1.045);
          }
        }

        @keyframes blackholeStreakDrift {
          0%, 100% {
            opacity: 0.45;
            transform: translate(-50%, -50%) translate3d(0, 0, 0);
          }
          50% {
            opacity: 0.75;
            transform: translate(-50%, -50%) translate3d(0.8%, -1.2%, 0);
          }
        }

        @keyframes blackholeHazeShimmer {
          0% {
            transform: translate(-50%, -50%) translate3d(-1.2%, 0, 0) skewX(0.4deg);
          }
          100% {
            transform: translate(-50%, -50%) translate3d(1.2%, 0, 0) skewX(-0.4deg);
          }
        }

        @keyframes blackholeBridgePulse {
          0%, 100% {
            opacity: 0.48;
          }
          50% {
            opacity: 0.64;
          }
        }

        @keyframes blackholeGlowFloat {
          0%, 100% {
            opacity: 0.52;
            transform: translate3d(0, 0, 0) scale(0.992);
          }
          50% {
            opacity: 0.68;
            transform: translate3d(0, -0.6%, 0) scale(1.012);
          }
        }

        @keyframes blackholeAmbientFloat {
          0%, 100% {
            opacity: 0.42;
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            opacity: 0.56;
            transform: translate3d(0, 0.5%, 0) scale(1.018);
          }
        }

        @media (max-width: 767px) {
          .blackhole-asset-stage {
            top: 43%;
            width: 232vw;
          }

          .blackhole-lower-field {
            width: 320vw;
            height: 64vh;
            top: 57%;
          }

          .blackhole-lower-streaks {
            width: 230vw;
            top: 55%;
          }

          .blackhole-lower-haze {
            width: 260vw;
            top: 58%;
          }
        }

        @media (min-width: 768px) and (max-width: 1279px) {
          .blackhole-asset-stage {
            top: 43%;
            width: 132vw;
          }
        }

        @media (min-width: 1280px) {
          .blackhole-asset-stage {
            top: 43%;
            width: min(110vw, 1900px);
          }
        }

        @media (min-width: 1800px) {
          .blackhole-asset-stage {
            width: min(104vw, 1980px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .blackhole-motion-layer,
          .blackhole-color-bridge,
          .blackhole-glow-core,
          .blackhole-glow-ambient,
          .blackhole-lower-field::before,
          .blackhole-lower-field::after,
          .blackhole-lower-streaks,
          .blackhole-lower-haze {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
