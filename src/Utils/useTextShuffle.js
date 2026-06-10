import { useEffect } from "react";

export default function useTextShuffle(ref, options) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const loadTimer = 30;
    const scrollTimer = 10;
    const loadChangeCap = 30;
    const scrollChangeCap = 5;
    let intervalId = null;

    const randomDigit = () => Math.floor(Math.random() * 10);
    const selectIndex = max => Math.floor(Math.random() * max);

    const setupSpans = (mode) => {
      const numbers = el.dataset.initial || "";
      const text = el.dataset.target || "";
      const changeCap = mode === "text" ? loadChangeCap : scrollChangeCap;

      const targetString = mode === "text" ? text : numbers;
      const initialString = mode === "text" ? numbers : text;

      el.innerHTML = "";

      for (let i = 0; i < targetString.length; i++) {
        const targetChar = targetString[i];
        const initialChar = initialString[i] ?? randomDigit().toString();

        const span = document.createElement("span");
        span.classList.add("ltr");

        if (targetChar !== " ") {
          span.classList.add("nbr");
          span.dataset.change = Math.round(Math.random() * changeCap).toString();
          span.dataset.target = targetChar;
          span.dataset.number = "0";
          span.textContent = /\d/.test(initialChar)
            ? initialChar
            : randomDigit().toString();
        } else {
          span.textContent = " ";
        }

        el.appendChild(span);
      }
    };

    const tick = () => {
      const activeSpans = Array.from(el.querySelectorAll(".nbr"));
      if (!activeSpans.length) {
        clearInterval(intervalId);
        intervalId = null;
        return;
      }

      activeSpans.forEach((span) => {
        const currentNumber = parseInt(span.dataset.number || "0", 10) + 1;
        span.dataset.number = currentNumber.toString();
        const threshold = parseInt(span.dataset.change || "0", 10);

        if (currentNumber > threshold) {
          span.textContent = span.dataset.target || "";
          span.classList.remove("nbr");
        }
      });

      const remaining = Array.from(el.querySelectorAll(".nbr"));
      if (!remaining.length) {
        clearInterval(intervalId);
        intervalId = null;
        return;
      }

      const selected = remaining[selectIndex(remaining.length)];
      selected.textContent = randomDigit();
    };

    const startShuffle = (mode, speed) => {
      if (intervalId) clearInterval(intervalId);

      setupSpans(mode);
      intervalId = setInterval(() => tick(speed), speed);
    };

    // run on load
    startShuffle("text", loadTimer);

    // scroll listener
    const onWheel = (e) => {
      if (e.deltaY < 0) startShuffle("text", scrollTimer);
      else if (e.deltaY > 0) startShuffle("numbers", scrollTimer);
    };

    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      if (intervalId) clearInterval(intervalId);
    };
  }, [ref, options]);
}
