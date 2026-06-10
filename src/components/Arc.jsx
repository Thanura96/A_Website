export default function Arc() {
  const TOP_PCT = 2.2;

  const WHITE = "rgba(255, 255, 255, 1)";
  const YELLOW = "rgba(227, 228, 27, 1)";

  const textLeft = "calc(var(--img-x, 0px) + (var(--img-w, 0px) * 0.5))";
  const textTop = `calc(var(--img-y, 0px) + (var(--img-h, 0px) * ${TOP_PCT}) + var(--arc-top-shift, 0px) + var(--arc-global-shift, 0px))`;
  const textWidth = "calc(var(--img-w, 0px) * 0.96)";

  const logoFontSize =
    "var(--arc-logo-size, clamp(82px, calc(var(--img-w, 0px) * 0.24), 240px))";
  const gapSize = "var(--arc-logo-gap, clamp(10px, calc(var(--img-w, 0px) * 0.06), 80px))";

  const logoTextStyle = {
    fontFamily: "Yapari Trial",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: logoFontSize,
    lineHeight: "0.92",
    letterSpacing: "0.04em",
    color: WHITE,
  };

  const taglineStyle = {
    fontFamily: "SourceCodePro",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "var(--arc-tagline-size, 24px)",
    lineHeight: "1",
    letterSpacing: "0",
    color: WHITE,
    marginBottom: "clamp(8px, calc(var(--img-h, 0px) * 0.03), 14px)",
    whiteSpace: "var(--arc-tagline-space, nowrap)",
  };

  // âœ… <CA1-AAA3> + C2 (ARC letters à·€à¶½à¶§ à¶´à·„à·…à·’à¶±à·Š)
  const caLabel = "<CA1-AAA3>";

  const caFontSize =
    "var(--arc-ca-size, clamp(9px, calc(var(--img-w, 0px) * 0.008), 12px))";
  const c2FontSize =
    "var(--arc-c2-size, clamp(14px, calc(var(--img-w, 0px) * 0.014), 22px))";

  const caRowTopGap =
    "var(--arc-ca-gap-top, clamp(8px, calc(var(--img-h, 0px) * 0.013), 14px))";
  const caRowInnerGap =
    "var(--arc-ca-gap-inner, clamp(8px, calc(var(--img-w, 0px) * 0.009), 14px))";
  const caRowLeftOffset = "0.02em"; // fine-tune left/right (à¶…à·€à·à·Šâ€à¶º à¶±à¶¸à·Š à·€à·™à¶±à·ƒà·Š à¶šà¶»à¶±à·Šà¶±)

  const caRowStyle = {
    position: "absolute",
    top: `calc(100% + ${caRowTopGap})`,
    left: caRowLeftOffset,
    display: "var(--arc-ca-display, flex)",
    alignItems: "center",
    gap: caRowInnerGap,
    whiteSpace: "nowrap",
    pointerEvents: "none",
  };

  const caTextStyle = {
    fontFamily: "Helvetica Now Display",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: caFontSize,
    lineHeight: "1",
    letterSpacing: "0px",
    textTransform: "uppercase",
    color: WHITE, // âœ… white
  };

  const c2Style = {
    fontFamily: "Yapari Trial",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: c2FontSize,
    lineHeight: "1",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: WHITE, // âœ… white
  };

  // âœ… Small paragraph under OS (UPDATED: manual line breaks)
  const descText = [
    "Connected Warfare ensures U.S. and allied forces win at the edge, in",
    "fast-moving and contested environments where decisions must be",
    "made in seconds. We build AI-driven systems that connect sensors,",
    "shooters, and decision-makers for faster, smarter, and more",
    "resilient operations when every second counts.",
  ].join("\n");

  const descWidth =
    "var(--arc-desc-width, min(clamp(380px, calc(var(--img-w, 0px) * 0.44), 680px), 92vw))";
  const descGapBelowOS =
    "var(--arc-desc-gap, clamp(6px, calc(var(--img-h, 0px) * 0.012), 12px))";
  const descRightOffset = "var(--arc-desc-right, 24px)";
  const descMaxWidth =
    "var(--arc-desc-max-width, min(92vw, calc(var(--img-w, 0px) * 0.54)))";

  const descStyle = {
    fontFamily: "Helvetica Now Display",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "var(--arc-desc-size, 10px)",
    leadingTrim: "none",
    lineHeight: "var(--arc-desc-line-height, 1)",
    letterSpacing: "0",
    textAlign: "var(--arc-desc-align, right)",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.42)",
    whiteSpace: "pre-line",
  };

  // BIG paragraph gap below the vertical line (easy to tune)
  const paragraphGap =
    "var(--arc-paragraph-gap, clamp(110px, calc(var(--img-h, 0px) * 0.17), 220px))";
  const bottomWidth = "var(--arc-bottom-width, calc(var(--img-w, 0px) * 0.92))";
  const havenLineLeft = "var(--arc-haven-line-left, 47.5%)";
  const havenLineHeight =
    "var(--arc-haven-line-height, clamp(82px, calc(var(--img-w, 0px) * 0.11), 156px))";
  const havenLineLength = "var(--arc-haven-line-length, 100%)";
  const havenLineStroke = "var(--arc-haven-line-stroke, 1px)";
  const havenLineGapTop =
    "var(--arc-haven-line-gap-top, clamp(10px, calc(var(--img-w, 0px) * 0.016), 18px))";
  const havenLineGapBottom =
    "var(--arc-haven-line-gap-bottom, clamp(10px, calc(var(--img-w, 0px) * 0.014), 16px))";
  const havenLineClearance = "var(--arc-haven-line-clearance, 0px)";
  const bottomStyle = {
    fontFamily: "Helvetica Now Display",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize:
      "var(--arc-bottom-size, clamp(10px, calc(var(--img-w, 0px) * 0.012), 14px))",
    lineHeight: "1.35",
    letterSpacing: "0.04em",
    textAlign: "center",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.88)",
    whiteSpace: "normal",
  };

  const bottomText =
    "is a sovereign, AI-driven defense ecosystem engineered by Sri Lankan hands the roaring lions building national power from the ground up. Designed for Asian operational environments, ARC OS delivers 99.99% decision-making accuracy, commanding dominance from sky to sea to mud through UAVs, UGVs, USVs, electronic warfare, and joint-force Command & Control. This is not just software it is a unified ecosystem of AI models, computer vision, predictive intelligence, weather-aware analytics, hardened hardware, robotics, and autonomous systems. Built entirely in-house, our vision to 2035 is clear: a self-reliant, battle-ready defense industry transforming national security data into decisive first-action advantage.";

  const actionPanelHeadline = ["Simplified Development", "For AI-enabled Autonomy"];

  return (
    <div
      className="absolute inset-0 pointer-events-none arc-root"
      style={{ zIndex: 60, overflow: "visible" }}
    >
      <style>{`
        .arc-root {
          --arc-scale: 1;
          --arc-global-shift: -80px;
          --arc-top-shift: 0px;
          --arc-desc-shift: -18px;
          --arc-bottom-shift: -100px;
          --arc-tagline-size: 24px;
          --arc-tagline-space: nowrap;
          --arc-logo-size: clamp(82px, calc(var(--img-w, 0px) * 0.24), 240px);
          --arc-logo-gap: clamp(10px, calc(var(--img-w, 0px) * 0.06), 80px);
          --arc-ca-size: clamp(9px, calc(var(--img-w, 0px) * 0.008), 12px);
          --arc-c2-size: clamp(14px, calc(var(--img-w, 0px) * 0.014), 22px);
          --arc-ca-gap-top: clamp(8px, calc(var(--img-h, 0px) * 0.013), 14px);
          --arc-ca-gap-inner: clamp(8px, calc(var(--img-w, 0px) * 0.009), 14px);
          --arc-ca-display: flex;
          --arc-desc-size: 10px;
          --arc-desc-line-height: 1;
          --arc-desc-align: right;
          --arc-desc-width: min(clamp(380px, calc(var(--img-w, 0px) * 0.44), 680px), 92vw);
          --arc-desc-max-width: min(92vw, calc(var(--img-w, 0px) * 0.54));
          --arc-desc-gap: clamp(6px, calc(var(--img-h, 0px) * 0.012), 12px);
          --arc-desc-right: 24px;
          --arc-paragraph-gap: clamp(110px, calc(var(--img-h, 0px) * 0.17), 220px);
          --arc-bottom-width: calc(var(--img-w, 0px) * 0.92);
          --arc-bottom-size: clamp(10px, calc(var(--img-w, 0px) * 0.012), 14px);
          --arc-haven-line-left: 47.5%;
          --arc-haven-line-height: clamp(82px, calc(var(--img-w, 0px) * 0.11), 156px);
          --arc-haven-line-length: 100%;
          --arc-haven-line-stroke: 1px;
          --arc-haven-line-gap-top: clamp(10px, calc(var(--img-w, 0px) * 0.016), 18px);
          --arc-haven-line-gap-bottom: clamp(10px, calc(var(--img-w, 0px) * 0.014), 16px);
          --arc-haven-line-clearance: 0px;
          --arc-panel-gap: clamp(30px, calc(var(--img-h, 0px) * 0.055), 56px);
          --arc-panel-width: min(calc(var(--img-w, 0px) * 0.88), 1040px);
          --arc-panel-radius: clamp(28px, calc(var(--img-w, 0px) * 0.07), 54px);
          --arc-panel-heading-size: clamp(26px, calc(var(--img-w, 0px) * 0.031), 50px);
          --arc-panel-heading-gap: clamp(10px, calc(var(--img-h, 0px) * 0.02), 18px);
        }

        @media (max-width: 1200px) {
          .arc-root {
            --arc-scale: 0.98;
            --arc-tagline-size: 22px;
            --arc-logo-size: clamp(74px, calc(var(--img-w, 0px) * 0.235), 210px);
            --arc-logo-gap: clamp(8px, calc(var(--img-w, 0px) * 0.055), 64px);
            --arc-desc-width: min(clamp(340px, calc(var(--img-w, 0px) * 0.46), 620px), 92vw);
            --arc-desc-max-width: min(92vw, calc(var(--img-w, 0px) * 0.52));
            --arc-desc-right: 16px;
            --arc-desc-shift: -14px;
            --arc-panel-width: min(calc(var(--img-w, 0px) * 0.9), 980px);
          }
        }
        @media (max-width: 992px) {
          .arc-root {
            --arc-scale: 0.96;
            --arc-tagline-size: 20px;
            --arc-desc-size: 9px;
            --arc-logo-size: clamp(66px, calc(var(--img-w, 0px) * 0.23), 180px);
            --arc-logo-gap: clamp(8px, calc(var(--img-w, 0px) * 0.05), 52px);
            --arc-desc-width: min(clamp(300px, calc(var(--img-w, 0px) * 0.5), 560px), 92vw);
            --arc-desc-max-width: min(92vw, calc(var(--img-w, 0px) * 0.54));
            --arc-desc-right: 10px;
            --arc-desc-shift: -10px;
            --arc-panel-heading-size: clamp(22px, calc(var(--img-w, 0px) * 0.033), 40px);
          }
        }
        @media (max-width: 768px) {
          .arc-root {
            --arc-scale: 0.93;
            --arc-tagline-size: 18px;
            --arc-desc-size: 8px;
            --arc-logo-size: clamp(56px, calc(var(--img-w, 0px) * 0.215), 150px);
            --arc-logo-gap: clamp(6px, calc(var(--img-w, 0px) * 0.045), 38px);
            --arc-ca-size: clamp(7px, calc(var(--img-w, 0px) * 0.008), 10px);
            --arc-c2-size: clamp(10px, calc(var(--img-w, 0px) * 0.012), 16px);
            --arc-desc-width: min(clamp(260px, 76vw, 470px), 94vw);
            --arc-desc-max-width: 94vw;
            --arc-desc-right: 4px;
            --arc-desc-shift: -6px;
            --arc-haven-line-left: 48%;
            --arc-haven-line-length: 92%;
            --arc-haven-line-clearance: clamp(8px, calc(var(--img-h, 0px) * 0.02), 18px);
            --arc-bottom-width: min(calc(var(--img-w, 0px) * 0.94), 94vw);
            --arc-panel-width: min(calc(var(--img-w, 0px) * 0.94), 94vw);
            --arc-panel-heading-size: clamp(18px, calc(var(--img-w, 0px) * 0.036), 30px);
          }
        }
        @media (max-width: 560px) {
          .arc-root {
            --arc-scale: 0.9;
            --arc-tagline-size: 16px;
            --arc-logo-size: clamp(48px, calc(var(--img-w, 0px) * 0.205), 124px);
            --arc-logo-gap: clamp(4px, calc(var(--img-w, 0px) * 0.04), 28px);
            --arc-ca-display: none;
            --arc-desc-size: 7px;
            --arc-desc-line-height: 1.08;
            --arc-desc-align: center;
            --arc-desc-width: min(clamp(220px, 84vw, 400px), 96vw);
            --arc-desc-max-width: 96vw;
            --arc-desc-right: 0px;
            --arc-desc-shift: -2px;
            --arc-haven-line-left: 49%;
            --arc-haven-line-length: 85%;
            --arc-haven-line-clearance: clamp(14px, calc(var(--img-h, 0px) * 0.03), 28px);
            --arc-bottom-width: min(calc(var(--img-w, 0px) * 0.96), 96vw);
            --arc-panel-gap: clamp(24px, calc(var(--img-h, 0px) * 0.045), 42px);
            --arc-panel-width: min(calc(var(--img-w, 0px) * 0.96), 96vw);
            --arc-panel-radius: clamp(24px, calc(var(--img-w, 0px) * 0.075), 38px);
            --arc-panel-heading-size: clamp(15px, calc(var(--img-w, 0px) * 0.04), 25px);
          }
        }
        @media (max-width: 420px) {
          .arc-root {
            --arc-scale: 0.88;
            --arc-tagline-size: 14px;
            --arc-logo-size: clamp(42px, calc(var(--img-w, 0px) * 0.195), 108px);
            --arc-logo-gap: clamp(4px, calc(var(--img-w, 0px) * 0.035), 20px);
            --arc-desc-size: 6.5px;
            --arc-desc-line-height: 1.1;
            --arc-desc-width: min(clamp(200px, 90vw, 340px), 97vw);
            --arc-desc-max-width: 97vw;
            --arc-desc-right: 0px;
            --arc-desc-shift: 0px;
            --arc-haven-line-left: 50%;
            --arc-haven-line-length: 78%;
            --arc-haven-line-stroke: 0.9px;
            --arc-haven-line-clearance: clamp(20px, calc(var(--img-h, 0px) * 0.04), 36px);
            --arc-bottom-width: min(calc(var(--img-w, 0px) * 0.98), 98vw);
            --arc-panel-heading-size: clamp(13px, calc(var(--img-w, 0px) * 0.043), 20px);
          }
        }
        @media (max-width: 360px) {
          .arc-root {
            --arc-scale: 0.85;
            --arc-tagline-size: 13px;
            --arc-desc-size: 6px;
            --arc-logo-size: clamp(36px, calc(var(--img-w, 0px) * 0.185), 92px);
            --arc-logo-gap: clamp(2px, calc(var(--img-w, 0px) * 0.03), 14px);
            --arc-desc-line-height: 1.1;
            --arc-desc-width: 94vw;
            --arc-desc-max-width: 94vw;
            --arc-desc-right: 0px;
            --arc-desc-shift: 0px;
            --arc-haven-line-left: 50%;
            --arc-haven-line-length: 72%;
            --arc-haven-line-stroke: 0.8px;
            --arc-haven-line-clearance: clamp(24px, calc(var(--img-h, 0px) * 0.05), 44px);
            --arc-bottom-width: 98vw;
            --arc-panel-heading-size: clamp(12px, calc(var(--img-w, 0px) * 0.045), 18px);
          }
        }
      `}</style>

      {/* TOP BLOCK */}
      <div
        style={{
          position: "absolute",
          top: textTop,
          left: textLeft,
          width: textWidth,
          maxWidth: "92vw",
          padding: "0 12px",
          transform: "translateX(-50%) scale(var(--arc-scale, 1))",
          transformOrigin: "top center",
          opacity: "var(--img-ready, 0)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          textTransform: "uppercase",
          overflow: "visible",
        }}
      >
        <div style={taglineStyle}>AGENTIC SOLUTIONS FOR DEFENSE AND INTELLIGENCE</div>

        {/* Wrapper keeps ARC/OS SAME + paragraph anchored to OS right edge */}
        <div style={{ position: "relative", display: "inline-block", overflow: "visible" }}>
          {/* LOGO ROW */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: gapSize,
              whiteSpace: "nowrap",
              overflow: "visible",
            }}
          >
            {/* âœ… ARC + (CA/C2) under ARC */}
            <span style={{ position: "relative", display: "inline-block", overflow: "visible" }}>
              <span
                style={{
                  ...logoTextStyle,
                  position: "relative",
                  display: "inline-block",
                  overflow: "visible",
                }}
              >
                ARC
              </span>

              {/* âœ… <CA1-AAA3>  C2 */}
              <div style={caRowStyle}>
                <span style={caTextStyle}>{caLabel}</span>
                <span style={c2Style}>C2</span>
              </div>
            </span>

            <span
              style={{
                ...logoTextStyle,
                letterSpacing: "0.02em",
                position: "relative",
                display: "inline-block",
                overflow: "visible",
              }}
            >
              <span style={{ color: YELLOW }}>O</span>
              <span style={{ color: WHITE }}>S</span>

              <div
                style={{
                  position: "absolute",
                  top: `calc(100% + ${descGapBelowOS} + var(--arc-desc-shift, 0px))`,
                  right: descRightOffset,
                  width: descWidth,
                  maxWidth: descMaxWidth,
                  pointerEvents: "none",
                }}
              >
                <div style={descStyle}>{descText}</div>
              </div>
            </span>
          </div>
        </div>

        {/* HAVEN LINE (vertical only) */}
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            width: "100%",
            height: havenLineHeight,
            marginTop: `calc(${havenLineGapTop} + ${havenLineClearance})`,
            marginBottom: havenLineGapBottom,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: havenLineLeft,
              top: `calc((100% - ${havenLineLength}) / 2)`,
              height: havenLineLength,
              width: havenLineStroke,
              backgroundColor: "rgba(255,255,255,0.82)",
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {/* BIG paragraph (same layer as ARC block for stable responsive positioning) */}
        <div
          style={{
            marginTop: `calc(${paragraphGap} + var(--arc-bottom-shift, 0px))`,
            width: bottomWidth,
            maxWidth: "98vw",
            padding: "0 12px",
          }}
        >
          <div style={bottomStyle}>
            <span style={{ fontWeight: 700, color: WHITE }}>ABSOLX ARC</span>{" "}
            {bottomText}
          </div>
        </div>

        <div
          style={{
            marginTop: "var(--arc-panel-gap)",
            width: "var(--arc-panel-width)",
            maxWidth: "98vw",
            padding: "0 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--arc-panel-heading-gap)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: "100%",
              aspectRatio: "1.58 / 1",
              border: `1.5px solid ${YELLOW}`,
              borderRadius: "var(--arc-panel-radius)",
              background:
                "radial-gradient(circle at 12% 100%, rgba(88, 105, 255, 0.55) 0%, rgba(29, 38, 92, 0.32) 22%, rgba(5, 8, 22, 0.18) 42%, rgba(0, 0, 0, 0) 58%), linear-gradient(180deg, rgba(3, 5, 10, 0.32) 0%, rgba(0, 0, 0, 0.7) 100%)",
              boxShadow: "0 0 0 1px rgba(227, 228, 27, 0.08), inset 0 0 32px rgba(0, 0, 0, 0.45)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0px",
              fontFamily: "Yapari Trial",
              fontWeight: 700,
              fontSize: "var(--arc-panel-heading-size)",
              lineHeight: "0.9",
              letterSpacing: "0.045em",
              textTransform: "uppercase",
              color: WHITE,
              textAlign: "center",
            }}
          >
            {actionPanelHeadline.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


