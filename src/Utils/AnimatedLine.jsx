"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedLine() {
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);

  // Both sparks move at the same speed (px/sec)
  const SPEED_PX_PER_SEC = 520;

  const [dur1, setDur1] = useState("3.2s");
  const [dur2, setDur2] = useState("3.2s");

  useEffect(() => {
    const l1 = path1Ref.current?.getTotalLength?.() ?? 0;
    const l2 = path2Ref.current?.getTotalLength?.() ?? 0;

    if (l1 > 0) setDur1(`${Math.max(1.2, l1 / SPEED_PX_PER_SEC).toFixed(2)}s`);
    if (l2 > 0) setDur2(`${Math.max(1.2, l2 / SPEED_PX_PER_SEC).toFixed(2)}s`);
  }, []);

  return (
    <div
      className="
        relative pointer-events-none
        z-30
        left-1/2 -translate-x-1/2

        top-0
        sm:top-2
        md:top-4
        lg:top-6
        xl:top-8

        translate-y-[15px]
        sm:translate-y-5
        md:translate-y-[25px]
        lg:translate-y-[76px]
        xl:translate-y-[30px]

        w-[200%]
        sm:w-[180%]
        md:w-[150%]
        lg:w-[125%]
        xl:w-[115%]
        2xl:w-[110%]

        -rotate-[0.5deg]
        origin-center
      "
    >
      <svg
        viewBox="0 0 1728 381"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="line1-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="4"
              floodColor="#000000"
              floodOpacity="0.3"
            />
          </filter>

          <linearGradient id="line1-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0b0b0b" stopOpacity="0.45" />
            <stop offset="12%" stopColor="#6f6a00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#feff00" stopOpacity="1" />
            <stop offset="88%" stopColor="#6f6a00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0b0b0b" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="spark-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff000" stopOpacity="0" />
            <stop offset="35%" stopColor="#fff000" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#fff900" stopOpacity="1" />
            <stop offset="65%" stopColor="#fff000" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fff000" stopOpacity="0" />
          </linearGradient>

          <filter id="spark-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.5" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base Paths */}
        <path
          ref={path1Ref}
          id="path1"
          d="M-79.2008 370.518C-56.7435 366.255 -35.6572 367.317 -13.0986 359.175C34.7614 341.902 85.5207 330.973 133.973 314.956C210.788 289.565 294.796 277.255 376.629 267.981C430.726 261.85 486.404 259.496 542.126 260.701C590.735 261.752 635.305 249.258 682.901 246.346C784.707 240.117 876.493 197.056 977.445 186.501C1054.22 178.474 1128.85 162.885 1203.99 148.619C1228.15 144.032 1254.07 150.371 1279.07 147.641C1302.03 145.135 1323.81 136.734 1346.36 132.453C1385.37 125.046 1422.29 100.836 1462.89 100.672C1494.99 100.542 1525.11 87.6501 1556.29 81.7304C1610.3 71.4774 1662.76 56.0843 1716.87 45.8121C1754.98 38.5761 1791.53 29.2537 1828.62 19.4647C1844.16 15.3636 1857.96 8.16104 1873.83 5.1463C1877.18 4.51189 1908.27 -3.63428 1900.17 5.57843"
          stroke="url(#line1-gradient)"
          strokeWidth="1.9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter="url(#line1-shadow)"
        />

        <path
          ref={path2Ref}
          id="path2"
          d="M11.8599 341.551C34.4933 338.102 53.2336 327.424 77.882 329.626C130.176 334.297 181.973 328.398 234.186 330.968C316.96 335.042 399.822 316.792 479.192 295.026C531.661 280.638 583.702 260.017 634.018 234.152C677.912 211.589 724.83 210.664 769.763 194.36C865.873 159.484 971.087 183.033 1068.56 154.88C1142.69 133.47 1218.61 124.091 1294.34 112.55C1318.69 108.839 1339.23 88.3208 1363.43 81.5173C1385.65 75.2714 1409.71 78.1915 1432.44 74.7282C1471.75 68.7364 1517.5 88.3234 1554.67 71.0119C1584.06 57.3221 1617.98 63.2266 1649.4 58.4376C1703.83 50.143 1759.4 50.0617 1813.93 41.7516C1852.34 35.8977 1890.36 33.7817 1929.1 32.1211C1945.33 31.4253 1961.51 36.0354 1977.51 33.5965C1980.88 33.0833 2013.33 31.6028 2001.36 21.5745"
          stroke="#FBFD00"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Spark 1 (Line 1) - Start together, Left -> Right */}
        <ellipse
          rx="30"
          ry="0.55"
          fill="url(#spark-grad)"
          filter="url(#spark-glow)"
          className="mix-blend-screen"
        >
          <animateMotion
            dur={dur1}
            begin="0s"
            repeatCount="indefinite"
            rotate="auto"
            calcMode="linear"
            keyPoints="0;1"
            keyTimes="0;1"
          >
            <mpath href="#path1" />
          </animateMotion>

          <animate
            attributeName="opacity"
            values="0.55;0.95;0.55"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Spark 2 (Line 2) - Start together, Left -> Right */}
        <ellipse
          rx="30"
          ry="0.55"
          fill="url(#spark-grad)"
          filter="url(#spark-glow)"
          className="mix-blend-screen"
        >
          <animateMotion
            dur={dur2}
            begin="0s"
            repeatCount="indefinite"
            rotate="auto"
            calcMode="linear"
            keyPoints="0;1"
            keyTimes="0;1"
          >
            <mpath href="#path2" />
          </animateMotion>

          <animate
            attributeName="opacity"
            values="0.55;0.95;0.55"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </ellipse>
      </svg>
    </div>
  );
}
