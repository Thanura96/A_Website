import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FullStackSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const counterRef = useRef(null);

  const features = [
    "World-class Data",
    "Diffusion models",
    "AI Agents",
    "pipeline automation",
    "ai consultant",
    "SOUL Defense Llama",
    "Video 2 Video pipeline",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Paragraph style tagline animation
      gsap.from(paragraphRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.4,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Highlight glow effect - REMOVED (no element with this class)
      // If you want to add glow to title, uncomment below and add class to h2
      // const highlightElement = sectionRef.current.querySelector('.highlight-absxl');
      // if (highlightElement) {
      //   gsap.to(highlightElement, {
      //     color: "#C7D65A",
      //     textShadow: "0px 0px 15px #C7D65A",
      //     repeat: -1,
      //     yoyo: true,
      //     duration: 2,
      //     ease: "sine.inOut",
      //   });
      // }

      // Counter Animation - Only if element exists
      if (counterRef.current) {
        gsap.fromTo(
          counterRef.current,
          { innerText: 0 },
          {
            innerText: 250,
            duration: 2,
            ease: "power1.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 mt-24 sm:mt-32 lg:mt-40 flex flex-col items-center text-center px-6 "
    >
      {/* Tagline */}
      <p
        ref={paragraphRef}
        className="text-[#C7D65A] text-[12px] tracking-[0.40em] mb-4 font-aeonik -mt-40 p-5"
      >
        AI FOR THE ENTERPRISE
      </p>

      {/* Title */}
      <h2
        ref={titleRef}
        className="font-azonix text-white text-3xl sm:text-4xl md:text-5xl mb-10"
      >
        FULL-STACK AI SOLUTIONS
      </h2>

      {/* Features List */}
      <div className="flex flex-wrap justify-center gap-x-1 gap-y-2 mb-10">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-white text-[16px] font-elios"
          >
            <FontAwesomeIcon icon={faCheck} className="text-[#C7D65A] text-xs" />
            {item}
          </div>
        ))}
      </div>

      {/* Book a Demo Button */}
      <div className="relative inline-block p-0.5 rounded-[40px] bg-linear-to-r from-[#C7D65A] to-[#7241FF] hover:shadow-[0_0_15px_#7241FF] mb-[120px]">
        <button className=" w-[166px] h-[39px] rounded-[40px] bg-[#010314] flex items-center justify-center gap-2 text-white font-medium text-[16px] leading-[19px] font-sf-compact cursor-pointer ">
          Book a Demo
          <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
        </button>
      </div>

      {/* Trusted By Counter - UNCOMMENT if you want to use it */}
      {/* <div className="relative inline-block p-[2px] rounded-[100px] bg-gradient-to-r from-[#C7D65A] to-[#FFFFFF] hover:shadow-[0_0_12px_rgba(255,255,255,0.2)] mt-4">
        <div className=" w-[286px] h-[62px] rounded-[100px] bg-[#0D0C1B] backdrop-blur-[2px] flex items-center justify-center text-white text-[16px] font-semibold font-['SF_Compact_Rounded'] px-[34px] cursor-pointer gap-1 ">
          Trusted By <span ref={counterRef}>0</span>+ Companies
        </div>
      </div> */}
    </section>
  );
}
