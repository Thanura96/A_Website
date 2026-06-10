import aboutIcon from "../assets/images/sub-menu/about.svg";
import contactIcon from "../assets/images/sub-menu/contact us.svg";
import securityIcon from "../assets/images/sub-menu/security.svg";
import blogIcon from "../assets/images/sub-menu/blog.svg";
import guidesIcon from "../assets/images/sub-menu/guides.svg";
import eventsIcon from "../assets/images/sub-menu/events.svg";
import careersIcon from "../assets/images/sub-menu/careers.svg";
import documentationIcon from "../assets/images/sub-menu/documentation.svg";
import researchIcon from "../assets/images/sub-menu/research.svg";
import news1 from "../assets/images/sub-menu/news1.png";
import news2 from "../assets/images/sub-menu/news2.png";

export default function SubMenu({ closing = false }) {
  return (
    <div
      className={`
        absolute left-1/2 top-[90px] -translate-x-1/2
        w-[95%] max-w-[800px]
        bg-[rgba(0,0,0,0.1)]
        backdrop-blur-md
        border border-[#C7D65A]/30
        rounded-lg
        flex flex-col md:flex-row gap-6 md:gap-10
        p-6 md:p-10
        overflow-hidden
        ${closing ? "animate-fadeSlideUpClose" : "animate-fadeSlideDown"}
      `}
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4 md:gap-6 w-full md:w-1/2 font-code">
        <h3 className="text-white font-medium text-[11px] tracking-[3px] font-code">
          IN ABS<span className="text-[#C7D65A]">O</span>L X
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-x-1 gap-y-3 md:gap-y-4">
          <SubMenuItem icon={aboutIcon} label="ABOUT" />
          <SubMenuItem icon={contactIcon} label="CONTACT US" />
          <SubMenuItem icon={securityIcon} label="SECURITY" />
          <SubMenuItem icon={blogIcon} label="BLOG" />
          <SubMenuItem icon={guidesIcon} label="GUIDES" />
          <SubMenuItem icon={eventsIcon} label="EVENTS" />
          <SubMenuItem icon={careersIcon} label="CAREERS" />
          <SubMenuItem icon={documentationIcon} label="DOCUMENTATION" />
          <SubMenuItem icon={researchIcon} label="RESEARCH" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2">
        <h3 className="text-white font-medium text-[11px] tracking-[2px]">
          FEATURES NEWS
        </h3>

        <div className="mt-4 md:mt-6 flex flex-col gap-4 md:gap-6">
          {/* News 1 */}
          <div className="flex gap-3 md:gap-4">
            <img
              src={news1}
              width="100"
              height="70"
              alt="news"
              className="rounded object-cover w-[100px] md:w-[120px]"
            />
            <div className="flex flex-col leading-4 md:leading-5 font-code">
              <p className="text-white text-[10px] md:text-[11px] font-light">
                Crumbling Under Pressure:
              </p>
              <p className="text-white text-[10px] md:text-[11px] font-extralight">
                PropensityBench Reveals AI's Weaknesses
              </p>
            </div>
          </div>

          {/* News 2 */}
          <div className="flex gap-3 md:gap-4">
            <img
              src={news2}
              width="100"
              height="70"
              alt="news"
              className="rounded object-cover w-[100px] md:w-[120px]"
            />
            <div className="flex flex-col leading-4 md:leading-5 font-code">
              <p className="text-white text-[10px] md:text-[11px] font-light">
                Crumbling Under Pressure:
              </p>
              <p className="text-white text-[10px] md:text-[11px] font-extralight">
                PropensityBench Reveals AI's Weaknesses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubMenuItem({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-white uppercase font-code font-medium tracking-widest text-[9px] md:text-[10px] cursor-pointer hover:text-[#C7D65A] transition">
      <img
        src={icon}
        width="15"
        height="15"
        alt={label}
        className="inline-block w-3 md:w-[15px] h-3 md:h-[15px]"
      />
      {label}
    </div>
  );
}
