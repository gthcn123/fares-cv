import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { ThemeLangToggle } from "./ThemeLangToggle";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";
import { Home, Compass, MessageSquare, Mail } from "lucide-react";

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

  const iconButtonBase =
    "focus-ring relative p-3 rounded-lg transition-all duration-300 z-10 active:scale-[0.94] flex items-center justify-center";

  return (
    <motion.header
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      style={{ 
        top: "50%",
        left: "calc(env(safe-area-inset-left, 0px) + 1rem)",
        transform: "translateY(-50%)"
      }}
      className="fixed z-50 pointer-events-none [&>*]:pointer-events-auto"
    >
      <LayoutGroup id="navbar">
      <nav
        className={`flex flex-col items-center gap-2 rounded-2xl p-2 transition-all duration-300 backdrop-blur-xl border ${
          scrolled
            ? "bg-oklch(0.138_0.022_265)/90 border-oklch(0.182_0.04_265)/50 shadow-lg"
            : "bg-oklch(0.138_0.022_265)/80 border-oklch(0.182_0.04_265)/40 shadow-md"
        }`}
      >
        {/* Home Icon */}
        <Link
          to="/"
          preload="intent"
          title={t("Home", "الرئيسية")}
          className={`${iconButtonBase} ${
            onHome 
              ? "bg-oklch(0.182_0.04_265) text-foreground" 
              : "text-foreground/70 hover:text-foreground hover:bg-oklch(0.182_0.04_265)/60"
          }`}
        >
          <Home className="w-5 h-5" />
        </Link>
        
        {/* Explore Icon */}
        <Link
          to="/explore"
          preload="intent"
          title={t("Explore", "استكشف")}
          className={`${iconButtonBase} ${
            onExplore
              ? "bg-oklch(0.182_0.04_265) text-foreground"
              : "text-foreground/70 hover:text-foreground hover:bg-oklch(0.182_0.04_265)/60"
          }`}
        >
          <Compass className="w-5 h-5" />
        </Link>
        
        {/* Comments Icon */}
        {showComments && (
          <Link
            to="/comments"
            preload="intent"
            title={t("Comments", "التعليقات")}
            className={`${iconButtonBase} ${
              onComments
                ? "bg-oklch(0.182_0.04_265) text-foreground"
                : "text-foreground/70 hover:text-foreground hover:bg-oklch(0.182_0.04_265)/60"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
        )}
        
        {/* Divider */}
        <div className="w-6 h-px bg-oklch(0.182_0.04_265)/30" />
        
        {/* Contact Icon */}
        <Link
          to="/"
          hash="contact"
          title={contactLabel}
          className={`${iconButtonBase} bg-oklch(0.482_0.18_268) text-background hover:bg-oklch(0.482_0.18_268)/85 transition-all duration-300`}
        >
          <Mail className="w-5 h-5" />
        </Link>
        
        {/* Divider */}
        <div className="w-6 h-px bg-oklch(0.182_0.04_265)/30" />
        
        {/* Theme & Language Toggle */}
        <div className="flex justify-center">
          <ThemeLangToggle />
        </div>
      </nav>
      </LayoutGroup>
    </motion.header>
  );
}
