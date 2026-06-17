"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES, type Locale } from "@/lib/i18n";
import { useI18n } from "./LanguageProvider";

// Sélecteur de langue façon menu de barre macOS : un libellé court (« FR ») cliquable qui
// déroule un petit panneau translucide. Ferme au clic extérieur et à Échap.
export function LanguageMenu() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const pick = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Changer la langue"
        className={`rounded px-1.5 py-0.5 font-mono text-[12px] font-semibold tabular-nums transition-colors ${
          open ? "bg-white/15 text-white" : "text-white/75 hover:text-white"
        }`}
      >
        {LOCALE_LABELS[locale]}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-[160px] origin-top-right overflow-hidden rounded-[10px] border border-white/15 bg-[#22252D]/85 p-1 shadow-[0_18px_40px_-12px_rgba(0,0,0,.75)] backdrop-blur-xl"
          >
            {LOCALES.map((code) => {
              const active = code === locale;
              return (
                <button
                  key={code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => pick(code)}
                  className={`flex w-full items-center gap-2 rounded-[7px] px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                    active
                      ? "bg-[#2E8BFF] text-white"
                      : "text-white/85 hover:bg-white/10"
                  }`}
                >
                  <span className="w-3.5 text-center text-[11px]">
                    {active ? "✓" : ""}
                  </span>
                  <span className="flex-1">{LOCALE_NAMES[code]}</span>
                  <span className="font-mono text-[11px] text-white/55">
                    {LOCALE_LABELS[code]}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
