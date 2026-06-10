"use client";

import React, { useRef } from "react";
import useTextShuffle from "../Utils/useTextShuffle";

export default function Title({ className = "" }) {
  const stableRef = useRef(null);
  const omniRef = useRef(null);
  const universalRef = useRef(null);
  const learnerRef = useRef(null);

  useTextShuffle(stableRef);
  useTextShuffle(omniRef);
  useTextShuffle(universalRef);
  useTextShuffle(learnerRef);

  return (
    <div
      style={{
        "--fs": "clamp(16px, 5vw, 64px)",
        "--gap": "clamp(6px, 2.4vw, 44px)",
        "--ml": "clamp(26px, 7vw, 82px)",
        "--track": "clamp(0.03em, 0.12vw, 0.10em)",
        "--scale": "clamp(0.72, calc(100vw / 620), 1)",

        // ✅ Row2 offset = font-size එකට proportional (stable look)
        "--row2shift": "clamp(-6px, calc(var(--fs) * -0.08), -2px)",
        transform: "scale(var(--scale))",
        transformOrigin: "top left",
      }}
      className={`
        relative isolate z-[60] w-max
        mt-6
        overflow-visible
        pointer-events-none
        ${className}
      `}
    >
      <div
        className="
          grid items-start
          ml-[var(--ml)]
          grid-cols-[max-content_var(--gap)_max-content]
          grid-rows-2
        "
      >
        <h1
          ref={stableRef}
          data-initial="29733"
          data-target="STABLE"
          className="
            col-start-1 row-start-1
            font-azonix tracking-[var(--track)]
            whitespace-nowrap leading-none
            text-gradient
            text-[length:var(--fs)]
            pointer-events-none
          "
        >
          STABLE
        </h1>

        <h1
          ref={omniRef}
          data-initial="99977"
          data-target="OMNI"
          className="
            col-start-3 row-start-1
            font-azonix tracking-[var(--track)]
            whitespace-nowrap leading-none
            text-white
            text-[length:var(--fs)]
            pointer-events-none
          "
        >
          OMNI
        </h1>

        {/* ✅ mt ඉවත් කරලා translateY */}
        <div
          className="
            col-start-3 row-start-2
            flex flex-row items-baseline whitespace-nowrap
            translate-y-[var(--row2shift)]
            gap-x-[var(--gap)]
          "
        >
          <h1
            ref={universalRef}
            data-initial="17413"
            data-target="UNIVERSAL"
            className="
              font-azonix tracking-[var(--track)]
              whitespace-nowrap leading-none
              text-universal
              text-[length:var(--fs)]
              pointer-events-none
            "
          >
            UNIVERSAL
          </h1>

          <h1
            ref={learnerRef}
            data-initial="83345"
            data-target="LEARNER"
            className="
              font-azonix tracking-[var(--track)]
              whitespace-nowrap leading-none
              text-white
              text-[length:var(--fs)]
              pointer-events-none
            "
          >
            LEARNER
          </h1>
        </div>
      </div>
    </div>
  );
}
