"use client";

import React, { useEffect, useRef } from "react";

export default function SubTitle() {
  const subtitleRef = useRef(null);

  useEffect(() => {
    const initType = async () => {
      if (!subtitleRef.current) return;
      try {
        const { TypeShuffle } = await import("../../Utils/typeShuffle");
        const shuffle = new TypeShuffle(subtitleRef.current);
        shuffle.trigger("fx3");
      } catch (err) {
        console.error("Subtitle Shuffle Error:", err);
      }
    };
    initType();
  }, []);

  const yellowStyle = {
    background: "#C7D65A",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <div
      className="
        relative z-20
        mt-4 sm:mt-6 md:mt-20
        font-code text-center uppercase
        px-4
        w-[90%] sm:w-[80%] md:w-[70%] lg:w-[55%] xl:w-[80%]
        mx-auto
      "
    >
      <p
        ref={subtitleRef}
        className="
          text-[10px] sm:text-[12px] md:text-[12px]
          text-white opacity-90
          leading-relaxed tracking-wide
        "
      >
        <span style={yellowStyle}>SOUL Super</span> Agentic{" "}
        <span style={yellowStyle}>Intelligence</span> Platform for World
        <br />
        ABSOL X CORE AI is an independent AI research and innovation company
        driving the future of Generative AI, Agentic Intelligence, and
        Super-intelligent LLMs.
      </p>
    </div>
  );
}
