// "use client";

// import React, { useRef } from "react";
// import useTextShuffle from "../../Utils/useTextShuffle";

// export default function Title() {
//   const stableRef = useRef(null);
//   const universalRef = useRef(null);

//   useTextShuffle(stableRef);
//   useTextShuffle(universalRef);

//   return (
//     <div
//       className="
//     relative z-20
//     flex flex-col items-center text-center
//     mt-[8vh] 
//     sm:mt-[6vh]
//     md:mt-[2vh]
//     lg:mt-[-8vh]
//     xl:mt-[-10vh]
//     px-4
//   "
//     >
//       {/* STABLE OMNI */}
//       <h1
//         ref={stableRef}
//         data-initial="29733 99977"
//         data-target="STABLE OMNI"
//         className="
//     text-gradient font-azonix tracking-[0.13em]
//     whitespace-nowrap
//     text-[28px]  xs:text-[30px]  sm:text-[40px] md:text-[50px] lg:text-[75px]
//     -mb-2 sm:-mb-4 md:-mb-6 lg:-mb-8 
//   "
//       />

//       {/* UNIVERSAL LEARNER */}
//       <h1
//         ref={universalRef}
//         data-initial="17413 10000 83345"
//         data-target="UNIVERSAL LEARNER"
//         className="
//   text-gradient2 font-azonix tracking-[0.13em]
//   whitespace-nowrap
//   text-[22px] xs:text-[30px] sm:text-[40px] md:text-[50px] lg:text-[70px]
// "
//       />
//     </div>
//   );
// }


import React, { useRef } from "react";
import useTextShuffle from "../../Utils/useTextShuffle";

export default function Title() {
  const absolRef = useRef(null);
  const xRef = useRef(null);

  useTextShuffle(absolRef);
  useTextShuffle(xRef);

  return (
    <div
      className="
        relative z-20
        flex items-center justify-center
        mt-[8vh]
        sm:mt-[6vh]
        md:mt-[2vh]
        lg:mt-[-2vh]
        xl:mt-[-4vh]
        2xl:mt-[-10vh]
        px-4
      "
    >
      <div className="flex items-center gap-5 sm:gap-7 md:gap-9 lg:gap-8 xl:gap-10 2xl:gap-12 mt-2 ml-0 sm:ml-2 md:ml-4 lg:ml-2 xl:ml-4 2xl:ml-6">
        <h1
          ref={absolRef}
          data-initial="48290"
          data-target="ABSOL"
          className="
            relative inline-block isolate z-0
            absolx-gradient font-yapari-regular tracking-[0.2em]
            whitespace-nowrap leading-none 
            text-[36px] sm:text-[48px] md:text-[64px] lg:text-[100px] xl:text-[120px] 2xl:text-[145px]

            before:content-['']
            before:absolute
            before:top-1/2
            before:-translate-y-1/2
            before:rounded-full
            before:pointer-events-none
            before:z-[-1]
            before:bg-[radial-gradient(closest-side,rgba(0,0,0,0.98),rgba(0,0,0,0)_72%)]

            /* Mobile (default) */
            before:left-[-0.35em]
            before:w-[2.0em]
            before:h-[1.4em]
            before:blur-[10px]

            /* Small screens */
            sm:before:left-[-0.40em]
            sm:before:w-[2.3em]
            sm:before:h-[1.6em]
            sm:before:blur-[12px]

            /* Medium screens */
            md:before:left-[-0.48em]
            md:before:w-[2.6em]
            md:before:h-[1.8em]
            md:before:blur-[14px]

            /* Large screens */
            lg:before:left-[-0.58em]
            lg:before:w-[3.0em]
            lg:before:h-[2.1em]
            lg:before:blur-[16px]

            /* XL screens */
            xl:before:left-[-0.65em]
            xl:before:w-[3.2em]
            xl:before:h-[2.2em]
            xl:before:blur-[18px]
          "
        />
        <h1
          ref={xRef}
          data-initial="7"
          data-target="X"
          className="
            text-white font-yapari-regular tracking-[0.12em]
            whitespace-nowrap leading-none
            text-[36px] sm:text-[48px] md:text-[64px] lg:text-[100px] xl:text-[120px] 2xl:text-[145px]
          "
        />
      </div>
    </div>
  );
}
