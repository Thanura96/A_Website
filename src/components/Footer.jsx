import React from "react";

// App badges
import appStore from "../assets/footer/app_store.svg";
import googlePlay from "../assets/footer/google_play.svg";

// Social icons
import facebook from "../assets/footer/facebook.svg";
import github from "../assets/footer/github.svg";
import instagram from "../assets/footer/instagram.svg";
import linkedin from "../assets/footer/linkedin.svg";
import tiktok from "../assets/footer/tiktok.svg";
import x from "../assets/footer/x.svg";

// Fallback flag (this file EXISTS in your project already)
import sriLankaSvg from "../assets/footer/sri_lanka.svg";

/**
 * ƒo. SAFE IMAGE LOADING (Vite)
 * This avoids build errors when "another.png" doesn't exist.
 * - If you later add: src/assets/footer/another.png -> it will auto-load.
 * - If not found -> it uses sri_lanka.svg.
 */
const FLAG_IMAGES = import.meta.glob("../assets/footer/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const sriLankaPng =
  FLAG_IMAGES["../assets/footer/another.png"] ||
  FLAG_IMAGES["../assets/footer/sri_lanka.png"] ||
  FLAG_IMAGES["../assets/footer/srilanka.png"];

const sriLankaFlagSrc = sriLankaPng ?? sriLankaSvg;

/**
 * Data separated from UI = clean + maintainable.
 */
const ABOUT_LINKS = [
  { label: "FAQ", href: "#" },
  { label: "BLOG", href: "#" },
  { label: "SUPPORT", href: "#" },
  { label: "CONTACT US", href: "#" },
];

const INFO_LINKS = [
  { label: "LEGAL NOTICE", href: "#" },
  { label: "DMCA", href: "#" },
  { label: "TERMS OF SERVICE", href: "#" },
  { label: "COOKIE POLICY", href: "#" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: facebook },
  { label: "Instagram", href: "#", icon: instagram },
  { label: "X", href: "#", icon: x },
  { label: "LinkedIn", href: "#", icon: linkedin },
  { label: "TikTok", href: "#", icon: tiktok },
  { label: "GitHub", href: "#", icon: github },
];

/**
 * Link column component (About / Info)
 */
function FooterLinkGroup({ title, links }) {
  return (
    <nav aria-label={title}>
      <h3 className="font-elios text-sm font-bold tracking-[0.28em] text-white/90">
        {title}
      </h3>

      <ul className="mt-4 space-y-2 font-elios text-[11px] tracking-[0.14em] text-white/55">
        {links.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="transition-colors hover:text-white focus:outline-none focus-visible:text-white"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Bracket-corner button (matches reference style)
 */
function BracketButton({
  href = "#",
  variant = "slate",
  children,
  className = "",
}) {
  const variantBg =
    variant === "maroon"
      ? "bg-gradient-to-br from-[#4a1b2a]/85 to-[#16050b]/85"
      : "bg-gradient-to-br from-[#3b4356]/70 to-[#1b2233]/85";

  return (
    <a
      href={href}
      className={[
        "group relative inline-flex h-11 items-center justify-center",
        "px-7 font-elios text-[11px] uppercase tracking-[0.26em] text-white/85 whitespace-nowrap",
        "border border-white/25 backdrop-blur-sm",
        "transition-all duration-200",
        "hover:border-white/40 hover:text-white hover:shadow-[0_0_20px_rgba(140,170,255,0.10)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        variantBg,
        className,
      ].join(" ")}
    >
      {/* Corner brackets (thin like the screenshot) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-[2px] -top-[2px] h-3 w-3 border-l border-t border-white/80"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[2px] -top-[2px] h-3 w-3 border-r border-t border-white/80"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-[2px] -bottom-[2px] h-3 w-3 border-b border-l border-white/80"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[2px] -bottom-[2px] h-3 w-3 border-b border-r border-white/80"
      />

      {/* Inner subtle border */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3px] border border-white/10"
      />

      <span className="relative z-10">{children}</span>
    </a>
  );
}

export default function Footer() {
  /**
   * Title tone: white + light-blue mix (NOT pure white)
   */
  const titleTone =
    "bg-gradient-to-b from-white via-[#B9C9FF] to-white/75 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(150,180,255,0.18)]";

  return (
    <footer className="relative overflow-hidden bg-black text-white font-elios z-50">
      {/* ======================================================
         BACKGROUND LAYERS
         Goal: blend into black page without that blue band edge.
         - Keep top area pure black for a while
         - Push glows lower (no glow touching the top edge)
      ======================================================= */}

      {/* Base gradient: black stays at top, then fades into navy/blue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,1)_0%,_rgba(0,0,0,1)_22%,_rgba(7,11,24,1)_55%,_rgba(30,59,150,1)_100%)]"
      />

      {/* Lower glow (kept low so it doesn't create top band) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_82%,_rgba(120,150,255,0.28)_0%,_rgba(10,14,28,0)_68%)]"
      />

      {/* Vignette to darken edges like the reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_45%,_rgba(0,0,0,0.88)_100%)]"
      />

      {/* Strong top mask (band remover) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-b from-black via-black to-transparent"
      />

      {/* ======================================================
         CONTENT
      ======================================================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-10 sm:px-10">
        <section className="w-full">
          <div className="mx-auto max-w-[1500px] px-6 sm:px-10 [--gap:48px]">
            {/* Top row: Left | Center | Right */}
            <div className="pb-[var(--gap)]">
              <div className="grid gap-10 md:grid-cols-3 md:items-start">
                {/* Left columns */}
                <div className="grid grid-cols-2 gap-10 sm:gap-14">
                  <FooterLinkGroup title="ABOUT" links={ABOUT_LINKS} />
                  <FooterLinkGroup title="INFO" links={INFO_LINKS} />
                </div>

                {/* Center: buttons + tagline + flag */}
                <div className="flex flex-col items-center md:pt-1">
                  <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:gap-0 font-elios">
                    <BracketButton
                      href="#"
                      variant="maroon"
                      className="w-full max-w-[260px] sm:w-[190px] sm:max-w-none "
                    >
                      CONTACT US
                    </BracketButton>

                    {/* Thin connector line */}
                    <div
                      aria-hidden="true"
                      className="hidden h-px w-12 bg-white/45 sm:block"
                    />

                    <BracketButton
                      href="#"
                      variant="slate"
                      className="w-full max-w-[260px] sm:w-[220px] sm:max-w-none"
                    >
                      OPEN ROLES
                    </BracketButton>
                  </div>

                  <p className="mt-10 text-center font-elios text-[9px] tracking-[0.32em] text-white/55 whitespace-nowrap sm:text-[10px]">
                    THE LION&apos;S ROAR - HEARD BY THE WORLD
                  </p>

                  {/* Flag: object-contain prevents cropping for PNG */}
                  <div className="mt-6 inline-flex items-center justify-center rounded-md px-2 py-1 ">
                    <img
                      src={sriLankaFlagSrc}
                      alt="Sri Lanka"
                      className="h-6 w-10 object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Right: App + Social */}
                <div className="md:justify-self-end">
                  <h3 className="font-elios text-sm font-bold tracking-[0.28em] text-white/90">
                    GET THE APP
                  </h3>

                  <div className="mt-4 flex items-center gap-3">
                    <a
                      href="#"
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      <img
                        src={googlePlay}
                        alt="Get it on Google Play"
                        className="h-9"
                        loading="lazy"
                      />
                    </a>
                    <a
                      href="#"
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      <img
                        src={appStore}
                        alt="Download on the App Store"
                        className="h-9"
                        loading="lazy"
                      />
                    </a>
                  </div>

                  <h3 className="mt-7 font-elios text-sm font-bold tracking-[0.28em] text-white/90">
                    STAY TUNED
                  </h3>

                  <div className="mt-4 flex items-center gap-4">
                    {SOCIAL_LINKS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                      >
                        <img
                          src={s.icon}
                          alt=""
                          className="h-5 w-5"
                          loading="lazy"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* WHITE LINE */}
            {/* WHITE LINE - extends beyond container padding */}
            {/* WHITE LINE - extends beyond container padding */}
            {/* WHITE LINE - responsive across all devices */}
           <div
  aria-hidden="true"
  className="h-px 
             -mx-6 
             sm:-mx-10 
             md:-mx-16 
             lg:-mx-20 
             xl:-mx-24 
             bg-white/80 
             shadow-[0_0_1px_rgba(255,255,255,0.45)]"
/>

            {/* Big title: equal gap around the divider */}
            <div className="pt-[var(--gap)] text-center">
              <div className="mx-auto max-w-6xl px-4">
                {/* Desktop: 4 columns (balanced like screenshot, not extreme justify-between) */}
                <div className="grid grid-cols-2 items-center justify-items-center gap-x-10 gap-y-6 sm:grid-cols-4 sm:gap-x-10 md:gap-x-14">
                  <span
                    className={[
                      "font-elios uppercase leading-none",
                      "text-[clamp(2.3rem,6.1vw,5.9rem)]",
                      "tracking-[0.15em]",
                      titleTone,
                    ].join(" ")}
                  >
                    ABSOL
                  </span>

                  <span
                    className={[
                      "font-elios uppercase leading-none",
                      "text-[clamp(2.3rem,6.1vw,5.9rem)]",
                      "tracking-[0.15em]",
                      titleTone,
                    ].join(" ")}
                  >
                    X
                  </span>

                  <span
                    className={[
                      "font-elios uppercase leading-none",
                      "text-[clamp(2.3rem,6.1vw,5.9rem)]",
                      "tracking-[0.15em]",
                      titleTone,
                    ].join(" ")}
                  >
                    CORE
                  </span>

                  <span
                    className={[
                      "font-elios uppercase leading-none",
                      "text-[clamp(2.3rem,6.1vw,5.9rem)]",
                      "tracking-[0.15em]",
                      titleTone,
                    ].join(" ")}
                  >
                    AI
                  </span>
                </div>
              </div>

              <p className="mt-4 font-elios text-[10px] tracking-[0.28em] text-white/45">
                Ac 2026 ABSOL X CORE AI. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}