import React from "react";
import faceImage from "../assets/face.png";

/**
 * Feature overlay under SOUL.
 * Replaces the old Government / Enterprise / Defense HUD labels.
 */
export default function SoulGrid() {
  const sectionLeft =
    "calc(var(--img-x, 0px) + (var(--img-w, 0px) * 0.5))";
  const sectionTop =
    "calc(var(--img-y, 0px) + (var(--img-h, 0px) * var(--soul-face-top, 0.98)))";

  const labels = [
    {
      text: "AI-based trainable behaviors",
      className: "soul-face-label soul-face-label-top-left",
    },
    {
      text: "Modular and extensible",
      className: "soul-face-label soul-face-label-mid-right",
    },
    {
      text: "Resilient autonomy for complex missions",
      className: "soul-face-label soul-face-label-bottom-left",
    },
    {
      text: "Multiple domains supported",
      className: "soul-face-label soul-face-label-bottom-right",
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 soul-face-root">
      <style>{`
        .soul-face-root {
          --soul-face-top: 0.98;
          --soul-face-width: clamp(500px, calc(var(--img-w, 0px) * 0.84), 1080px);
          --soul-face-height: clamp(340px, calc(var(--img-h, 0px) * 0.68), 660px);
          --soul-face-image-width: clamp(240px, calc(var(--img-w, 0px) * 0.3), 460px);
          --soul-face-label-size: clamp(9px, calc(var(--img-w, 0px) * 0.009), 13px);
          --soul-face-label-track: clamp(1px, calc(var(--img-w, 0px) * 0.0022), 3px);
        }

        .soul-face-section {
          position: absolute;
          opacity: var(--img-ready, 0);
          width: var(--soul-face-width);
          height: var(--soul-face-height);
          transform: translateX(-50%);
        }

        .soul-face-glow {
          position: absolute;
          inset: 5% -10% 0 auto;
          width: 46%;
          height: 92%;
          background: linear-gradient(90deg, rgba(14, 18, 48, 0), rgba(73, 92, 211, 0.52));
          filter: blur(36px);
          border-radius: 999px;
        }

        .soul-face-image {
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--soul-face-image-width);
          max-width: 54%;
          transform: translate(-50%, -50%);
          object-fit: contain;
          filter: contrast(1.08) brightness(1.05) drop-shadow(0 20px 42px rgba(80, 96, 180, 0.18));
          animation: soulFaceFloat 7s ease-in-out infinite;
          will-change: transform;
        }

        .soul-face-label {
          position: absolute;
          color: rgba(255, 255, 255, 0.88);
          font-family: "SourceCodePro", monospace;
          font-size: var(--soul-face-label-size);
          font-weight: 400;
          letter-spacing: var(--soul-face-label-track);
          line-height: 1.35;
          text-transform: none;
          white-space: nowrap;
          text-shadow: 0 0 14px rgba(255, 255, 255, 0.18);
        }

        .soul-face-label-top-left {
          top: 13%;
          left: 9%;
        }

        .soul-face-label-mid-right {
          top: 39%;
          right: 7%;
        }

        .soul-face-label-bottom-left {
          top: 64%;
          left: 5%;
        }

        .soul-face-label-bottom-right {
          top: 79%;
          right: 4%;
        }

        @keyframes soulFaceFloat {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .soul-face-image {
            animation: none;
          }
        }

        @media (max-width: 768px) {
          .soul-face-root {
            --soul-face-top: 1.04;
            --soul-face-width: calc(var(--img-w, 0px) * 0.92);
            --soul-face-height: clamp(320px, calc(var(--img-h, 0px) * 0.72), 580px);
            --soul-face-image-width: clamp(200px, calc(var(--img-w, 0px) * 0.42), 340px);
            --soul-face-label-size: clamp(7px, calc(var(--img-w, 0px) * 0.014), 10px);
            --soul-face-label-track: clamp(0.8px, calc(var(--img-w, 0px) * 0.002), 2px);
          }

          .soul-face-label-top-left,
          .soul-face-label-bottom-left {
            left: 2%;
          }

          .soul-face-label-mid-right,
          .soul-face-label-bottom-right {
            right: 2%;
          }
        }

        @media (max-width: 480px) {
          .soul-face-root {
            --soul-face-top: 1.08;
            --soul-face-height: clamp(300px, calc(var(--img-h, 0px) * 0.8), 500px);
            --soul-face-image-width: clamp(170px, calc(var(--img-w, 0px) * 0.52), 280px);
            --soul-face-label-size: clamp(6px, calc(var(--img-w, 0px) * 0.016), 9px);
            --soul-face-label-track: clamp(0.5px, calc(var(--img-w, 0px) * 0.0016), 1.5px);
          }

          .soul-face-label {
            white-space: normal;
            max-width: 48%;
          }

          .soul-face-label-mid-right,
          .soul-face-label-bottom-right {
            text-align: right;
          }
        }
      `}</style>

      <div
        className="soul-face-section"
        style={{
          left: sectionLeft,
          top: sectionTop,
        }}
      >
        <div className="soul-face-glow" />
        <img className="soul-face-image" src={faceImage} alt="" aria-hidden="true" />

        {labels.map((label) => (
          <div key={label.text} className={label.className}>
            {label.text}
          </div>
        ))}
      </div>
    </div>
  );
}
