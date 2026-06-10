// import { useState, useEffect } from "react";
// import MenuItem from "../components/MenuItem";
// import SubMenu from "./SubMenu";
// import MobileSubMenu from "./MobileSubMenu";
// import logo from "../assets/images/new-logo.svg";

// export function Navbar() {
//   const [openSub, setOpenSub] = useState(false);
//   const [subMenuVisible, setSubMenuVisible] = useState(false);

//   const [openMobile, setOpenMobile] = useState(false);
//   const [mobileSubVisible, setMobileSubVisible] = useState(false);
//   const [mobileSubClosing, setMobileSubClosing] = useState(false);

//   const [activeMenu, setActiveMenu] = useState("");

//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   /* ---------------- SCROLL BEHAVIOR ---------------- */
//   useEffect(() => {
//     const handleScroll = () => {
//       const current = window.scrollY;

//       if (current < 50) setIsVisible(true);
//       else if (current > lastScrollY && current > 100) setIsVisible(false);
//       else if (current < lastScrollY) setIsVisible(true);

//       setLastScrollY(current);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY]);

//   /* ---------------- HANDLERS ---------------- */
//   const handleMenuClick = (menu) => {
//     setActiveMenu(menu);
//     if (menu !== "SOURCE") {
//       setOpenSub(false);
//       setTimeout(() => setSubMenuVisible(false), 120);
//     }
//   };

//   const toggleSourceMenu = () => {
//     setActiveMenu("SOURCE");

//     if (openSub) {
//       setOpenSub(false);
//       setTimeout(() => setSubMenuVisible(false), 150);
//     } else {
//       setSubMenuVisible(true);
//       setTimeout(() => setOpenSub(true), 10);
//     }
//   };

//   const toggleMobileSource = () => {
//     setActiveMenu("SOURCE");

//     if (mobileSubVisible) {
//       setMobileSubClosing(true);
//       setTimeout(() => {
//         setMobileSubVisible(false);
//         setMobileSubClosing(false);
//       }, 220);
//     } else {
//       setMobileSubVisible(true);
//     }
//   };

//   /* ---------------- RENDER ---------------- */

//   return (
//     <nav
//       className={`
//         fixed top-0 left-0 right-0 z-9999
//         transition-transform duration-300
//         px-4 sm:px-6 md:px-10 lg:px-14 py-4
//         ${isVisible ? "translate-y-0" : "-translate-y-full"}
//       `}
//     >
//       {/* NAV WRAPPER */}
//       <div className="w-full max-w-[1500px] mx-auto flex items-center justify-between">

//         {/* LOGO */}
//         <img
//           src={logo}
//           alt="Logo"
//           className="w-[95px] sm:w-[120px] md:w-[150px] lg:w-[170px] h-auto cursor-pointer"
//         />

//         {/* DESKTOP MENU */}
//         <div className="hidden lg:flex flex-1 justify-center">
//           <div className="flex items-center gap-8 xl:gap-12 text-[10px] xl:text-[11px] font-azonix tracking-[2px]">
//             {["HOME","RESEARCH","PRODUCT","SERVICES","SAFETY"].map((m)=>(
//               <MenuItem
//                 key={m}
//                 active={activeMenu === m}
//                 onClick={() => handleMenuClick(m)}
//               >
//                 {m}
//               </MenuItem>
//             ))}

//             {/* SOURCE */}
//             <MenuItem
//               active={activeMenu === "SOURCE"}
//               onClick={toggleSourceMenu}
//             >
//               SOURCE
//             </MenuItem>

//             {/* PRICE */}
//             <MenuItem
//               active={activeMenu === "PRICE"}
//               onClick={() => handleMenuClick("PRICE")}
//             >
//               PRICE
//             </MenuItem>
//           </div>
//         </div>

//         {/* CTA BUTTON — Updated to neon style */}
//         <button
//           className="
//             hidden lg:block 
//             px-4 py-[3px]
//             rounded-full
//             text-[10px]
//             tracking-[2px]
//             font-azonix
//             text-[#C7D65A]
//             border border-[#C7D65A]/70
//             shadow-[0_0_8px_rgba(234,255,0,0.35)]
//             hover:bg-[#C7D65A] hover:text-black
//             transition-all duration-200
//           "
//         >
//           TRY NOW
//         </button>

//         {/* MOBILE BURGER */}
//         <button
//           className={`menu lg:hidden ml-auto ${openMobile ? "opened" : ""}`}
//           onClick={() => setOpenMobile(!openMobile)}
//         >
//           <svg width="38" height="38" viewBox="0 0 100 100">
//             <path className="line line1" d="M 20 29 H 80" />
//             <path className="line line2" d="M 20,50 H 80" />
//             <path className="line line3" d="M 20 71 H 80" />
//           </svg>
//         </button>
//       </div>

//       {/* DESKTOP SUBMENU */}
//       {subMenuVisible && <SubMenu closing={!openSub} />}

//       {/* MOBILE MENU */}
//       {openMobile && (
//         <div className="
//           lg:hidden w-full mt-3
//           bg-black/80 backdrop-blur-xl
//           border-t border-[#C7D65A]/20
//           p-6 animate-mobileMenu
//         ">
//           <div className="flex flex-col gap-5 text-white font-azonix text-[11px] tracking-[3px]">

//             {["HOME","RESEARCH","PRODUCT","SERVICES","SAFETY"].map((m)=>(
//               <button
//                 key={m}
//                 onClick={() => { handleMenuClick(m); setOpenMobile(false); }}
//                 className={`${activeMenu === m ? "text-[#C7D65A]" : ""}`}
//               >
//                 {m}
//               </button>
//             ))}

//             {/* MOBILE SOURCE */}
//             <button
//               onClick={toggleMobileSource}
//               className={`${activeMenu === "SOURCE" ? "text-[#C7D65A]" : ""}`}
//             >
//               SOURCE
//             </button>

//             {mobileSubVisible && (
//               <MobileSubMenu closing={mobileSubClosing} />
//             )}

//             <button
//               onClick={() => { handleMenuClick("PRICE"); setOpenMobile(false); }}
//               className={`${activeMenu === "PRICE" ? "text-[#C7D65A]" : ""}`}
//             >
//               PRICE
//             </button>

//             <button className="
//               mt-3 px-4 py-2 rounded-full border border-[#C7D65A]/60
//               text-[#C7D65A] tracking-[2px]
//             ">
//               TRY NOW
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;

import { useState, useEffect } from "react";
import MenuItem from "../components/MenuItem";
import logo from "../assets/images/new-logo.svg";

export function Navbar() {
  const [openMobile, setOpenMobile] = useState(false);

  const [activeMenu, setActiveMenu] = useState("HOME");

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  /* ---------------- SCROLL BEHAVIOR ---------------- */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current < 50) setIsVisible(true);
      else if (current > lastScrollY && current > 100) setIsVisible(false);
      else if (current < lastScrollY) setIsVisible(true);

      setLastScrollY(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* ---------------- HANDLERS ---------------- */
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-9999
        transition-transform duration-300
        px-4 sm:px-6 md:px-10 lg:px-14 py-4
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* NAV WRAPPER */}
      <div className="w-full max-w-[1500px] mx-auto flex items-center justify-between">

        {/* LOGO */}
        <img
          src={logo}
          alt="Logo"
          className="h-[46px] sm:h-[50px] md:h-[50px] lg:h-[50px] w-auto cursor-pointer"
        />

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-8 xl:gap-12 text-[10px] xl:text-[11px] font-azonix tracking-[2px]">
            {["HOME","RESEARCH","GOVERNMENT","ENTERPRISE","SAFETY","COMPANY"].map((m)=>(
              <MenuItem
                key={m}
                active={activeMenu === m}
                onClick={() => handleMenuClick(m)}
              >
                {m}
              </MenuItem>
            ))}
          </div>
        </div>

        {/* CTA BUTTON — Updated to neon style */}
        <button
          className="
            hidden lg:block 
            px-4 py-[3px]
            rounded-full
            text-[10px]
            tracking-[2px]
            font-azonix
            text-[#C7D65A]
            border border-[#C7D65A]/70
            shadow-[0_0_8px_rgba(234,255,0,0.35)]
            hover:bg-[#C7D65A] hover:text-black
            transition-all duration-200
          "
        >
          TRY NOW
        </button>

        {/* MOBILE BURGER */}
        <button
          className={`menu lg:hidden ml-auto ${openMobile ? "opened" : ""}`}
          onClick={() => setOpenMobile(!openMobile)}
        >
          <svg width="38" height="38" viewBox="0 0 100 100">
            <path className="line line1" d="M 20 29 H 80" />
            <path className="line line2" d="M 20,50 H 80" />
            <path className="line line3" d="M 20 71 H 80" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {openMobile && (
        <div className="
          lg:hidden w-full mt-3
          bg-black/80 backdrop-blur-xl
          border-t border-[#C7D65A]/20
          p-6 animate-mobileMenu
        ">
          <div className="flex flex-col gap-5 text-white font-azonix text-[11px] tracking-[3px]">

            {["HOME","RESEARCH","GOVERNMENT","ENTERPRISE","SAFETY","COMPANY"].map((m)=>(
              <button
                key={m}
                onClick={() => { handleMenuClick(m); setOpenMobile(false); }}
                className={`${activeMenu === m ? "text-[#C7D65A]" : ""}`}
              >
                {m}
              </button>
            ))}

            <button className="
              mt-3 px-4 py-2 rounded-full border border-[#C7D65A]/60
              text-[#C7D65A] tracking-[2px]
            ">
              TRY NOW
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
