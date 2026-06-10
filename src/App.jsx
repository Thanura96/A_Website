import SubTitle from "./components/hero/SubTitle";
import Title from "./components/hero/Title";
import Navbar from "./components/Navbar";
import AnimatedLine from "./Utils/AnimatedLine";
import CoreAI from "./assets/core.svg";
import BlackHoleCanvas from "./components/BlackholeCanvas";
import FloatingText from "./components/FloatingText";
import Glitch from "./components/Glitch";
import Stable from "./components/stable";
import Footer from "./components/Footer";
import Drone from "./components/drone";

export default function App() {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Glow Background Container */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        {/* Top-left glow */}
        <div
          className="
            absolute rounded-full
            bg-[radial-gradient(circle,rgba(77,121,234,0.24),transparent_80%)]
            blur-[80px]
            top-[-40vw] left-[-40vw] w-[120vw] h-[120vw]
            sm:top-[-30vw] sm:left-[-30vw] sm:w-[110vw] sm:h-[110vw]
            md:top-[-45vw] md:left-[-35vw] md:w-screen md:h-[100vw]
            lg:top-[6.5vw] lg:left-[-50vw] lg:w-[90vw] lg:h-[90vw]
          "
        ></div>

        {/* Top-right glow */}
        <div
          className="
            absolute rounded-full
            bg-[radial-gradient(circle,rgba(77,121,234,0.25),transparent_80%)]
            blur-[100px]
            top-[-40vw] right-[-40vw] w-[120vw] h-[120vw]
            sm:top-[-30vw] sm:right-[-30vw] sm:w-[110vw] sm:h-[110vw]
            md:top-[-25vw] md:right-[-35vw] md:w-screen md:h-[100vw]
            lg:top-[1vw] lg:right-[-60vw] lg:w-[90vw] lg:h-[90vw]
          "
        ></div>
      </div>

      <AnimatedLine />

      <div
        className="
          absolute right-2 sm:right-6 md:right-8
          top-[52vh]
          sm:top-[45vh]
          md:top-[40vh]
          lg:top-[35vh]
          xl:top-[40vh]
          2xl:top-[38vh]
          z-30 pointer-events-none
        "
      >
        <img
          src={CoreAI}
          alt="Core AI"
          className="
            h-28 sm:h-[200px] md:h-[260px] lg:h-[340px] xl:h-[420px] 2xl:h-[480px]
            w-auto opacity-60
          "
        />
      </div>

      <div className="relative z-20 flex flex-col items-center">
        <Title />
        <SubTitle />
      </div>

      {/* BlackHole Section */}
      <div className="relative z-0 mt-12 w-full">
        <BlackHoleCanvas />
        <FloatingText />
        <div className="absolute inset-x-0 top-[78vh] z-30 pointer-events-none flex justify-start pl-[6vw]">
          <Stable />
        </div>
      </div>

      {/* Glitch Section */}
      <section className="relative w-full h-[120vh] bg-black z-[60] mb-[50%]">
        <Glitch />
      </section>

      {/* Drone Section */}
      <section className="relative z-[80] bg-black mb-[20%]">
        <Drone />
      </section>


      {/* FullStack Section (optional - currently commented) */}
      {/* <section className="relative w-full bg-black z-30">
        <FullStackSection />
      </section> */}

      {/* Footer - now has its own layer properties (w-full, z-50) */}
      <Footer />
    </div>
  );
}
