"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

const MIN_WIDTH = 720;

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= MIN_WIDTH);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

export function SmallScreenNotice() {
  const { t } = useI18n();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="text-4xl">🖥️</div>
      <h1 className="font-mono text-lg text-white">{t("smallScreen.title")}</h1>
      <p className="max-w-xs text-sm text-white/60">{t("smallScreen.body")}</p>
    </div>
  );
}
