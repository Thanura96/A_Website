import React from 'react';

// Single text item with title + timestamp
const TextItem = ({ title, timestamp, color = "text-white" }) => (
  <div className="mb-3 md:mb-4">
    <p
      className={`${color} font-inter font-medium tracking-wide leading-tight`}
      style={{ fontSize: "clamp(10px, 1vw, 14px)" }}
    >
      {title}
    </p>
    <p
      className="text-gray-500 font-inter mt-1"
      style={{ fontSize: "clamp(9px, 0.8vw, 12px)" }}
    >
      {timestamp}
    </p>
  </div>
);

// Vertical Line Component
const VerticalLine = ({ height }) => (
  <svg width="2" height={height} viewBox={`0 0 2 ${height}`} fill="none">
    <line x1="1" y1="0" x2="1" y2={height} stroke="white" strokeWidth="1.3" />
  </svg>
);

export default function GlitchTextOverlay() {
  const leftTexts = [
    { title: "IDENTIFYING SECOND SUBJECT", timestamp: "Join at 14:24, 10/10/2025" },
    { title: "Surveillance Analysis", timestamp: "Join at 14:24, 10/10/2025" },
    { title: "HAWKEYE → Leash off. Gods-eye active. Good hunting.", timestamp: "Join at 14:24, 10/10/2025" }
  ];

  const rightTexts = [
    { title: "what is dark matter made of?", timestamp: "Join at 14:24, 10/10/2025" },
    { title: "What hides in the universe's shadows?", timestamp: "Join at 14:24, 10/10/2025" },
    { title: "Are we alone in eternity's expanse?", timestamp: "Join at 14:24, 10/10/2025" }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20">

      {/* -------------------- LEFT TEXT BLOCK -------------------- */}
      <div
        className="
          absolute
          left-[4vw] top-[16vh]          /* Mobile */
          sm:left-[6vw] sm:top-[20vh]    /* Tablet */
          md:left-[8vw] md:top-[26vh]    /* Desktop */
          xl:left-[10vw] xl:top-[28vh]   /* Ultrawide */
        "
      >
        {leftTexts.map((item, i) => (
          <TextItem key={i} {...item} />
        ))}
      </div>

      {/* Left vertical line */}
      <div
        className="
          absolute
          left-[5.5vw] top-[36vh]
          sm:left-[7vw] sm:top-[38vh]
          md:left-[10vw] md:top-[46vh]
        "
      >
        <VerticalLine height={window.innerHeight * 0.16} />
      </div>

      {/* -------------------- RIGHT TEXT BLOCK -------------------- */}
      <div
        className="
          absolute
          right-[4vw] top-[38vh]         /* Mobile stack */
          sm:right-[6vw] sm:top-[42vh]   /* Tablet */
          md:right-[8vw] md:top-[46vh]   /* Desktop */
          xl:right-[10vw] xl:top-[48vh]  /* Ultrawide */
        "
      >
        {rightTexts.map((item, i) => (
          <TextItem key={i} {...item} />
        ))}
      </div>

      {/* Right vertical line */}
      <div
        className="
          absolute
          right-[6.5vw] top-[22vh]
          sm:right-[9vw] sm:top-[26vh]
          md:right-[12vw] md:top-[30vh]
        "
      >
        <VerticalLine height={window.innerHeight * 0.12} />
      </div>
    </div>
  );
}
