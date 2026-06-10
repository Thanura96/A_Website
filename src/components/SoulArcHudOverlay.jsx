// SoulArcHudOverlay.jsx
export default function SoulArcHudOverlay() {
  // Shared responsive measurements
  const HUD_PAD_X = "clamp(12px, 4vw, 56px)";
  const HUD_PAD_TOP = "clamp(12px, 3vw, 38px)";

  const BOX_RIGHT = HUD_PAD_X;
  const BOX_BOTTOM = "clamp(90px, 16vh, 220px)";
  const BOX_W = "clamp(200px, 46vw, 560px)";
  const BOX_H = "clamp(52px, 9vw, 96px)";

  // Lines
  const TOP_LINE_Y = "clamp(50px, 7.5vh, 90px)";
  const H_LINE_LEN = "clamp(220px, 34vw, 640px)";
  const LINE_GAP = "clamp(40px, 10vw, 220px)";

  // ✅ FIX: vertical line X should be based on BOX_RIGHT (not HUD_PAD_TOP)
  const V_LINE_RIGHT = `calc(${BOX_RIGHT} + (${BOX_W} / 2))`;
  const H_LINE_RIGHT = `calc(${V_LINE_RIGHT} + ${LINE_GAP})`;

  // Vertical line ends exactly at TOP of the box
  const V_LINE_BOTTOM = `calc(${BOX_BOTTOM} + ${BOX_H})`;

  // Smooth current tuning (NO GLOW)
  const CURRENT_SPEED = "1.5s";
  const CURRENT_TRAIL = "clamp(70px, 9vw, 140px)";
  const EDGE_FADE = "clamp(36px, 5.2vw, 112px)";

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <style>{`
        /* ===== CLEAN LINE + SMOOTH CURRENT (NO SHADER/GLOW) ===== */
        @keyframes currentX {
          0%   { transform: translateX(calc(-1 * var(--trail))); opacity: 0; }
          10%  { opacity: 0.9; }
          90%  { opacity: 0.9; }
          100% { transform: translateX(calc(100% + var(--trail))); opacity: 0; }
        }
        @keyframes currentY {
          0%   { transform: translateY(calc(-1 * var(--trail))); opacity: 0; }
          10%  { opacity: 0.9; }
          90%  { opacity: 0.9; }
          100% { transform: translateY(calc(100% + var(--trail))); opacity: 0; }
        }

        .hud-line {
          position: absolute;
          pointer-events: none;
          --speed: ${CURRENT_SPEED};
          --trail: ${CURRENT_TRAIL};
          --edge: ${EDGE_FADE};
          overflow: hidden;
          opacity: 0.95;
        }

        .hud-line.h { height: 1px; }
        .hud-line.v { width: 1px; }

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
        .hud-line.v{
          -webkit-mask-image: linear-gradient(180deg,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,1) var(--edge),
            rgba(0,0,0,1) calc(100% - var(--edge)),
            rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(180deg,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,1) var(--edge),
            rgba(0,0,0,1) calc(100% - var(--edge)),
            rgba(0,0,0,0) 100%);
        }

        .hud-line .base { position: absolute; inset: 0; background: rgba(255,255,255,0.55); }

        .hud-line .current {
          position: absolute;
          opacity: 0;
          background: linear-gradient(90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.35) 20%,
            rgba(255,255,255,0.95) 60%,
            rgba(255,255,255,0.35) 80%,
            rgba(255,255,255,0) 100%);
        }

        .hud-line.h .current {
          top: 0; left: 0; height: 1px; width: var(--trail);
          animation: currentX var(--speed) linear infinite;
        }

        .hud-line.v .current {
          left: 0; top: 0; width: 1px; height: var(--trail);
          background: linear-gradient(180deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.35) 20%,
            rgba(255,255,255,0.95) 60%,
            rgba(255,255,255,0.35) 80%,
            rgba(255,255,255,0) 100%);
          animation: currentY var(--speed) linear infinite;
        }

        .hud-line .current.c2 {
          opacity: 0;
          animation-delay: calc(var(--speed) * 0.55);
          animation-duration: calc(var(--speed) * 1.12);
        }

        /* ✅ Mobile safe: lines shorter + less gap so they don't crash into text */
        @media (max-width: 640px) {
          .hud-line { opacity: 0.8; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hud-line .current { animation: none !important; }
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#000000ff",
            backgroundImage: `
              radial-gradient(60% 65% at 100% 48%,
                rgba(93,110,243,0.55) 0%,
                rgba(93,110,243,0.22) 42%,
                rgba(0,0,0,0) 72%
              ),
              linear-gradient(180deg, #000000ff 10%, #000000ff 25%, #000103 70%, #000000 100%)
            `,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.06,
            backgroundImage: `
              repeating-linear-gradient(0deg,
                rgba(255,255,255,0.05) 0px,
                rgba(255,255,255,0.05) 1px,
                rgba(0,0,0,0) 2px,
                rgba(0,0,0,0) 4px
              ),
              repeating-linear-gradient(90deg,
                rgba(255,255,255,0.035) 0px,
                rgba(255,255,255,0.035) 1px,
                rgba(0,0,0,0) 2px,
                rgba(0,0,0,0) 5px
              )
            `,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* HUD overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* ✅ Lines: show on ALL devices (no hidden md:block) */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          {/* Horizontal line */}
          <div
            className="hud-line h"
            style={{
              top: TOP_LINE_Y,
              right: `calc(${H_LINE_RIGHT} + 150px)`,
              width: "clamp(260px, 55vw, 640px)", // ✅ mobile-friendly
            }}
          >
            <div className="base" />
            <div className="current c1" />
            <div className="current c2" />
          </div>

          {/* Vertical line */}
          {/*
          <div
            className="hud-line v"
            style={{
              top: `calc(${HUD_PAD_TOP} + clamp(72px, 6vh, 160px))`, // slightly safer on small screens
              right: V_LINE_RIGHT,
              bottom: V_LINE_BOTTOM,
            }}
          >
            <div className="base" />
            <div className="current c1" />
            <div className="current c2" />
          </div>
          */}
        </div>

        {/* TOP HUD */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            paddingLeft: HUD_PAD_X,
            paddingRight: HUD_PAD_X,
            paddingTop: HUD_PAD_TOP,
            zIndex: 1,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-8">
            {/* Left text */}
            {/*
            <div className="min-w-0 md:max-w-[52%]">
              <div
                className="text-white/90 uppercase font-mono"
                style={{
                  fontSize: "clamp(9px, 0.85vw, 12px)",
                  letterSpacing: "clamp(0.12em, 0.22vw, 0.24em)",
                  lineHeight: 1.5,
                }}
              >
                SOUL ARC for Command &amp; Control (C2) is an AI-powered battle
                management &amp; command control platform
              </div>

              <div
                className="mt-3 text-white/70 uppercase font-mono"
                style={{
                  fontSize: "clamp(9px, 0.85vw, 12px)",
                  letterSpacing: "clamp(0.12em, 0.22vw, 0.22em)",
                }}
              >
                &lt;CA1-AAA3&gt;
              </div>
            </div>
            */}

            {/* ✅ Right text: stable image-like block */}
            {/*
            <div
              className="text-white/85 uppercase font-mono md:text-right"
              style={{
                maxWidth: "clamp(260px, 42vw, 680px)",
                fontSize: "clamp(9px, 0.85vw, 12px)",
                lineHeight: 1.55,
                letterSpacing: "clamp(0.06em, 0.14vw, 0.12em)",
                textWrap: "normal",         // ✅ remove balance (can cause odd breaks)
                wordBreak: "normal",
                overflowWrap: "anywhere",    // ✅ prevents overflow on tiny screens
              }}
            >
              Connected Warfare ensures U.S. and allied forces win at the edge, in
              fast-moving and contested environments where decisions must be made
              in seconds. We build AI-driven systems that connect sensors,
              shooters, and decision-makers for faster, smarter, and more
              resilient operations when every second counts.
            </div>
            */}
          </div>
        </div>

        {/* RIGHT BOX */}
        <div
          className="absolute"
          style={{
            right: BOX_RIGHT,
            bottom: BOX_BOTTOM,
            width: BOX_W,
            maxWidth: "calc(100vw - 24px)",
            zIndex: 1,
          }}
        >
          <div
            className="relative bg-white/10 border-2 border-white/40"
            style={{
              height: BOX_H,
              borderRadius: "2px",
              backdropFilter: "blur(2px)",
            }}
          >
            {/* Corner brackets */}
            <span
              className="absolute left-0 top-0"
              style={{
                width: "clamp(14px, 2.2vw, 18px)",
                height: "clamp(14px, 2.2vw, 18px)",
                borderLeft: "2px solid rgba(255,255,255,0.9)",
                borderTop: "2px solid rgba(255,255,255,0.9)",
              }}
            />
            <span
              className="absolute right-0 top-0"
              style={{
                width: "clamp(14px, 2.2vw, 18px)",
                height: "clamp(14px, 2.2vw, 18px)",
                borderRight: "2px solid rgba(255,255,255,0.9)",
                borderTop: "2px solid rgba(255,255,255,0.9)",
              }}
            />
            <span
              className="absolute left-0 bottom-0"
              style={{
                width: "clamp(14px, 2.2vw, 18px)",
                height: "clamp(14px, 2.2vw, 18px)",
                borderLeft: "2px solid rgba(255,255,255,0.9)",
                borderBottom: "2px solid rgba(255,255,255,0.9)",
              }}
            />
            <span
              className="absolute right-0 bottom-0"
              style={{
                width: "clamp(14px, 2.2vw, 18px)",
                height: "clamp(14px, 2.2vw, 18px)",
                borderRight: "2px solid rgba(255,255,255,0.9)",
                borderBottom: "2px solid rgba(255,255,255,0.9)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
 
