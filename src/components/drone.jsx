import React from "react";
import SourceCodeProRegular from "../assets/fonts/SourceCodePro-Regular.otf";

import DroneBlueprint from "../assets/image 40.png"; // main bg

const sourceCodePro = {
  fontFamily:
    "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

export default function Drone() {
  return (
    <section className="relative isolate z-50 w-full bg-black text-white drone-root">
      <style>{`
        @font-face {
          font-family: "Source Code Pro";
          src: url(${SourceCodeProRegular}) format("opentype");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        .drone-root {
          --drone-section-h: clamp(620px, 86vh, 820px);
          --drone-shift: 0px;
          --drone-bg-left: 73%;
          --drone-bg-top: 58%;
          --drone-bg-scale: min(430px, 36vw);
          --drone-line-left: 50%;
          --drone-line-top: 24%;
          --drone-line-height: 52%;
          --drone-fight-left: 8vw;
          --drone-fight-top: 31%;
          --drone-fight-size: clamp(34px, 4.2vw, 62px);
          --drone-label-left: 8.2vw;
          --drone-label-top: 65%;
          --drone-title-top: 22px;
          --drone-title-size: clamp(11px, 1.35vw, 24px);
          --drone-bg-size: var(--drone-bg-scale);
        }

        .drone-fight-text {
          font-family: "Yapari Trial", "Azonix", sans-serif;
          font-size: var(--drone-fight-size);
          font-weight: 700;
          line-height: 0.9;
          letter-spacing: 0.045em;
        }

        @media (max-width: 1024px) {
          .drone-root {
            --drone-section-h: clamp(560px, 82vh, 760px);
            --drone-shift: 0px;
            --drone-bg-left: 74%;
            --drone-bg-top: 58%;
            --drone-bg-scale: min(380px, 40vw);
            --drone-fight-left: 7vw;
            --drone-fight-top: 32%;
            --drone-fight-size: clamp(30px, 5vw, 54px);
            --drone-label-top: 64%;
            --drone-title-top: 18px;
          }
        }

        @media (max-width: 768px) {
          .drone-root {
            --drone-section-h: clamp(520px, 78vh, 700px);
            --drone-shift: 0px;
            --drone-bg-left: 74%;
            --drone-bg-top: 58%;
            --drone-bg-scale: min(320px, 48vw);
            --drone-line-left: 48%;
            --drone-line-top: 27%;
            --drone-line-height: 45%;
            --drone-fight-left: 6vw;
            --drone-fight-top: 34%;
            --drone-fight-size: clamp(26px, 6vw, 42px);
            --drone-label-top: 62%;
            --drone-title-top: 16px;
          }
        }

        @media (max-width: 480px) {
          .drone-root {
            --drone-section-h: 520px;
            --drone-shift: 0px;
            --drone-bg-left: 76%;
            --drone-bg-top: 58%;
            --drone-bg-scale: min(250px, 58vw);
            --drone-line-left: 48%;
            --drone-line-top: 30%;
            --drone-line-height: 40%;
            --drone-fight-left: 5vw;
            --drone-fight-top: 36%;
            --drone-fight-size: clamp(22px, 7vw, 32px);
            --drone-label-top: 61%;
            --drone-title-top: 14px;
          }
        }
      `}</style>

      <div className="relative overflow-hidden" style={{ height: "var(--drone-section-h)" }}>
        <div className="relative h-full overflow-hidden z-0">
          {/* ✅ Move everything down together */}
          <div
            className="absolute inset-0 z-0"
            style={{ transform: "translateY(var(--drone-shift))" }}
          >
            {/* ✅ MAIN BACKGROUND */}
            <img
              src={DroneBlueprint}
              alt=""
              aria-hidden="true"
              className="
                absolute
                -translate-x-1/2 -translate-y-1/2
                object-contain
                z-0
                pointer-events-none select-none
              "
              style={{
                left: "var(--drone-bg-left)",
                top: "var(--drone-bg-top)",
                width: "var(--drone-bg-size)",
                height: "var(--drone-bg-size)",
              }}
            />

            {/* ✅ overlay (below text) */}
            <div className="absolute inset-0 bg-black/10 z-10" />

            <div
              aria-hidden="true"
              className="absolute z-30 w-px bg-white/40"
              style={{
                left: "var(--drone-line-left)",
                top: "var(--drone-line-top)",
                height: "var(--drone-line-height)",
              }}
            />

            <div
              className="drone-fight-text absolute z-40 uppercase text-white"
              style={{
                left: "var(--drone-fight-left)",
                top: "var(--drone-fight-top)",
              }}
            >
              <div>FIGHT</div>
              <div>UNFAIR</div>
            </div>

            <div
              className="absolute z-40 border border-white/45 px-2 py-1 text-[6px] uppercase tracking-[0.06em] text-white/70 sm:text-[7px]"
              style={{
                ...sourceCodePro,
                left: "var(--drone-label-left)",
                top: "var(--drone-label-top)",
              }}
            >
              Agentic solutions for defense and intelligence
            </div>

            {/* ✅ TOP TEXT (never moves) */}
            <div
              className="absolute left-1/2 z-50 w-full -translate-x-1/2 px-6"
              style={{ ...sourceCodePro, top: "var(--drone-title-top)" }}
            >
              <div className="mx-auto" style={{ maxWidth: "min(1224px, 92vw)" }}>
                <p
                  className="text-center uppercase font-normal leading-[1.15] whitespace-normal sm:whitespace-nowrap"
                  style={{ fontSize: "var(--drone-title-size)" }}
                >
                  Command &amp; Control (C2) is an AI-powered battle management &amp;
                  command control platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
