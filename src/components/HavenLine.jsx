// import React from 'react';

// const HavenLine = () => {
//     return (
//         <div className="absolute inset-0 w-full h-full pointer-events-none">
//             {/* Container for the UI Elements - constrained to safety margins */}
//             <div className="relative w-full h-full p-6 md:p-12 flex flex-col justify-between">

//                 {/* Top Left - Identifier */}
//                 <div className="absolute top-8 left-8 md:top-12 md:left-12">
//                     <div className="font-mono text-xs md:text-sm text-gray-400 tracking-widest opacity-70">
//                         &lt;CA1 -aaa3&gt;
//                     </div>
//                 </div>

//                 {/* Top Right - Status/Date (Optional filler for balance) */}
//                 <div className="absolute top-8 right-8 md:top-12 md:right-12 text-right hidden md:block">
//                     {/* Placeholder for balance, can be removed if not needed */}
//                 </div>

//                 {/* Middle Area: CONNECTING LINES */}
//                 {/* Horizontal Line across the screen (optional, based on "lines" description) */}
//                 <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white/10 hidden"></div>

//                 {/* Content Positioned Relative to Bottom */}
//                 <div className="mt-auto w-full">

//                     {/* Main Title is handled by Glitch.jsx usually, but we can enhance or subtitle it */}
//                     {/* Subtitle Bar */}
//                     <div className="flex flex-col md:flex-row items-end justify-between w-full mb-32 md:mb-40">

//                         {/* Left Side: Description */}
//                         <div className="max-w-md mb-8 md:mb-0">
//                             <p className="font-mono text-[10px] md:text-xs text-gray-300 tracking-wider leading-relaxed uppercase border-l-2 border-white/30 pl-3">
//                                 SOUL ARC for Command & Control (C2) is an AI-powered battle management & command control platform
//                             </p>
//                         </div>

//                         {/* Right Side: Detailed Text */}
//                         <div className="max-w-md text-right relative group">
//                             {/* Decorative Line connecting to text */}
//                             <div className="absolute -top-4 right-0 w-24 h-[1px] bg-white/50"></div>
//                             <div className="absolute -top-4 right-24 w-[1px] h-4 bg-white/50"></div>

//                             <p className="font-mono text-[9px] md:text-[10px] text-gray-400 leading-relaxed uppercase">
//                                 Connected Warfare ensures U.S. and allied forces win at the edge, in fast-moving and contested environments where decisions must be made in seconds. We build AI-driven systems that connect sensors, shooters, and decision-makers for faster, smarter, and more resilient operations when every second counts.
//                             </p>

//                             {/* The "Box" element below the text */}
//                             <div className="mt-4 border border-white/20 bg-white/5 p-2 backdrop-blur-sm relative">
//                                 <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white"></div>
//                                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white"></div>
//                                 <div className="h-2 w-full bg-white/10"></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Floating UI Lines/Decorations */}
//             {/* Example: A line stretching from the "CA1" tag downwards */}
//             <div className="absolute top-16 left-10 w-[1px] h-32 bg-gradient-to-b from-white/30 to-transparent hidden md:block"></div>

//             {/* Example: Bottom right corner bracket */}
//             <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-white/20 hidden md:block"></div>

//         </div>
//     );
// };

// export default HavenLine;
