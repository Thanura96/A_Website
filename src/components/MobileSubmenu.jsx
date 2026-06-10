export default function MobileSubMenu({ closing = false }) {
  return (
    <div
      className={`
        mt-3 flex flex-col gap-6
        ${closing ? "animate-accordionClose" : "animate-accordion"}
      `}
    >
      {/* Title */}
      <p className="text-[12px] text-white font-medium tracking-[3px]">
        IN ABS<span className="text-[#C7D65A]">O</span>L X
      </p>

      {/* LEFT-ALIGNED LINKS */}
      <div className="flex flex-col gap-3 text-[11px] text-white opacity-90 tracking-widest items-start">
        <button className="hover:text-[#C7D65A]">ABOUT</button>
        <button className="hover:text-[#C7D65A]">CONTACT US</button>
        <button className="hover:text-[#C7D65A]">SECURITY</button>
        <button className="hover:text-[#C7D65A]">BLOG</button>
        <button className="hover:text-[#C7D65A]">GUIDES</button>
        <button className="hover:text-[#C7D65A]">EVENTS</button>
        <button className="hover:text-[#C7D65A]">CAREERS</button>
        <button className="hover:text-[#C7D65A]">DOCUMENTATION</button>
        <button className="hover:text-[#C7D65A]">RESEARCH</button>
      </div>

      {/* FEATURE NEWS */}
      <div className="flex flex-col gap-4 mt-4">
        <p className="text-white text-[12px] tracking-[2px] font-medium">
          FEATURES NEWS
        </p>

        {/* News 1 */}
        <div className="flex gap-4">
          <img
            src="/images/sub-menu/news1.png"
            width="100"
            height="70"
            alt="news"
            className="rounded"
          />
          <div className="flex flex-col leading-4">
            <p className="text-white text-[11px] font-light">
              Crumbling Under Pressure:
            </p>
            <p className="text-white text-[11px] font-extralight">
              PropensityBench Reveals AI’s Weaknesses
            </p>
          </div>
        </div>

        {/* News 2 */}
        <div className="flex gap-4">
          <img
            src="/images/sub-menu/news2.png"
            width="100"
            height="70"
            alt="news"
            className="rounded"
          />
          <div className="flex flex-col leading-4">
            <p className="text-white text-[11px] font-light">
              Crumbling Under Pressure:
            </p>
            <p className="text-white text-[11px] font-extralight">
              PropensityBench Reveals AI’s Weaknesses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
