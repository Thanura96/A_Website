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
          "radial-gradient(ellipse at 50% 35%, rgba(7, 34, 76, 0.62), rgba(1, 6, 17, 0.18) 45%, rgba(0, 0, 0, 0) 72%), linear-gradient(180deg, #02040a 0%, #030817 48%, #000000 100%)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black via-black/70 to-transparent" />

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
        <div className="blackhole-lens-glow" />
      </div>

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
            #000 62%,
            rgba(0, 0, 0, 0.72) 76%,
            rgba(0, 0, 0, 0.24) 90%,
            transparent 100%
          );
          mask-image: radial-gradient(
            ellipse 72% 64% at 50% 50%,
            #000 0%,
            #000 62%,
            rgba(0, 0, 0, 0.72) 76%,
            rgba(0, 0, 0, 0.24) 90%,
            transparent 100%
          );
        }

        .blackhole-still,
        .blackhole-motion-layer,
        .blackhole-video,
        .blackhole-lens-glow {
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
          filter: saturate(1.08) brightness(1.06) contrast(1.03);
        }

        .blackhole-motion-layer {
          z-index: 3;
          opacity: 0;
          overflow: hidden;
          transform-origin: 50% 50%;
          transition: opacity 420ms ease;
          mix-blend-mode: screen;
          -webkit-mask-image:
            radial-gradient(ellipse 70% 52% at 50% 50%,
              #000 0%,
              #000 46%,
              rgba(0, 0, 0, 0.54) 60%,
              transparent 78%),
            linear-gradient(180deg,
              transparent 0%,
              #000 17%,
              #000 78%,
              transparent 100%);
          -webkit-mask-composite: source-in;
          mask-image:
            radial-gradient(ellipse 70% 52% at 50% 50%,
              #000 0%,
              #000 46%,
              rgba(0, 0, 0, 0.54) 60%,
              transparent 78%),
            linear-gradient(180deg,
              transparent 0%,
              #000 17%,
              #000 78%,
              transparent 100%);
          mask-composite: intersect;
        }

        .blackhole-motion-layer.is-ready {
          opacity: 0.32;
        }

        .blackhole-video {
          object-fit: contain;
          object-position: center center;
          opacity: 1;
          filter: hue-rotate(312deg) saturate(1.35) contrast(1.2) brightness(1.08);
          transform: scale(1.015);
        }

        .blackhole-lens-glow {
          z-index: 4;
          background:
            radial-gradient(ellipse at 50% 44%,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(244, 105, 215, 0.08) 10%,
              rgba(46, 167, 255, 0.08) 26%,
              rgba(0, 0, 0, 0) 54%),
            linear-gradient(90deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(255, 55, 112, 0.08) 37%,
              rgba(100, 202, 255, 0.1) 50%,
              rgba(255, 55, 170, 0.08) 63%,
              rgba(0, 0, 0, 0) 100%);
          mix-blend-mode: screen;
          opacity: 0.22;
          animation: blackholeGlowPulse 5.5s ease-in-out infinite;
        }

        .blackhole-asset-stage::after {
          content: "";
          position: absolute;
          inset: -2px;
          z-index: 5;
          pointer-events: none;
          background:
            linear-gradient(180deg,
              rgba(0, 0, 0, 0.24) 0%,
              rgba(0, 0, 0, 0.08) 8%,
              rgba(0, 0, 0, 0) 22%,
              rgba(0, 0, 0, 0) 78%,
              rgba(0, 0, 0, 0.24) 100%),
            linear-gradient(90deg,
              rgba(0, 0, 0, 0.18) 0%,
              rgba(0, 0, 0, 0) 14%,
              rgba(0, 0, 0, 0) 86%,
              rgba(0, 0, 0, 0.18) 100%);
        }

        @keyframes blackholeGlowPulse {
          0%, 100% {
            opacity: 0.18;
            transform: scale(0.995);
          }
          45% {
            opacity: 0.34;
            transform: scale(1.008);
          }
        }

        @media (max-width: 767px) {
          .blackhole-asset-stage {
            top: 43%;
            width: 232vw;
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
          .blackhole-motion-layer {
            animation: none;
          }

          .blackhole-lens-glow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
