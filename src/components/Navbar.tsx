import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { ThemeLangToggle } from "./ThemeLangToggle";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const { t, lang } = useLang();
  const { data } = useSiteData();
  const nav = data.navigation;
  const showComments = nav?.showComments !== false;
  const contactLabel = lang === "ar"
    ? nav?.contactLabelAr || "تواصل"
    : nav?.contactLabelEn || "Contact";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onComments = loc.pathname === "/comments";
  const onExplore = loc.pathname === "/explore";
  const onHome = loc.pathname === "/";

  const navLinkBase =
    "focus-ring relative px-2 sm:px-3.5 py-1 sm:py-1.5 text-xs rounded-full transition-colors duration-300 whitespace-nowrap z-10 active:scale-[0.97]";

  const pillSpring = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.8 };

  const verticalNavLinkBase =
    "focus-ring relative px-3.5 py-2 text-xs rounded-lg transition-all duration-300 whitespace-nowrap z-10 active:scale-[0.96] text-center";

  return (
    <motion.header
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      style={{ 
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
        right: "calc(env(safe-area-inset-right, 0px) + 1rem)"
      }}
      className="fixed z-50 pointer-events-none [&>*]:pointer-events-auto"
    >
      <LayoutGroup id="navbar">
      <nav
        className={`flex flex-col items-stretch gap-1 rounded-2xl px-2 py-2 transition-all duration-300 backdrop-blur-xl border text-xs ${
          scrolled
            ? "bg-oklch(0.138_0.022_265)/85 border-oklch(0.182_0.04_265)/40 shadow-lg"
            : "bg-oklch(0.138_0.022_265)/75 border-oklch(0.182_0.04_265)/30 shadow-md"
        }`}
      >
        <Link
          to="/"
          preload="intent"
          className={`relative ${verticalNavLinkBase} font-display text-sm shrink-0 ${
            onHome 
              ? "bg-oklch(0.182_0.04_265) text-foreground" 
              : "text-foreground/80 hover:text-foreground hover:bg-oklch(0.182_0.04_265)/50"
          }`}
        >
          <span className="relative">Fares.</span>
        </Link>
        
        <div className="h-px bg-oklch(0.182_0.04_265)/20" />
        
        <Link
          to="/explore"
          preload="intent"
          className={`${verticalNavLinkBase} ${
            onExplore
              ? "bg-oklch(0.182_0.04_265) text-foreground"
              : "text-foreground/70 hover:text-foreground hover:bg-oklch(0.182_0.04_265)/50"
          }`}
        >
          {t("Explore", "استكشف")}
        </Link>
        
        {showComments && (
          <>
            <div className="h-px bg-oklch(0.182_0.04_265)/20" />
            <Link
              to="/comments"
              preload="intent"
              className={`${verticalNavLinkBase} ${
                onComments
                  ? "bg-oklch(0.182_0.04_265) text-foreground"
                  : "text-foreground/70 hover:text-foreground hover:bg-oklch(0.182_0.04_265)/50"
              }`}
            >
              {t("Comments", "التعليقات")}
            </Link>
          </>
        )}
        
        <div className="h-px bg-oklch(0.182_0.04_265)/20" />
        
        <Link
          to="/"
          hash="contact"
          className={`${verticalNavLinkBase} bg-oklch(0.482_0.18_268) text-background hover:bg-oklch(0.482_0.18_268)/90 transition-all duration-300 shrink-0 active:scale-[0.96]`}
        >
          {contactLabel}
        </Link>
        
        <div className="h-px bg-oklch(0.182_0.04_265)/20" />
        
        <div className="flex justify-center">
          <ThemeLangToggle />
        </div>
      </nav>
      </LayoutGroup>
    </motion.header>
  );
}
