"use client";

import { useEffect, useState } from "react";
import { COLORS, formatClock, formatDate } from "@/lib/theme";
import { localeToIntl } from "@/lib/i18n";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { LanguageMenu } from "@/components/i18n/LanguageMenu";

// Icônes de statut purement décoratives (non cliquables) — façon menubar macOS.
function WifiIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <path d="M5 12.86a10 10 0 0 1 14 0" />
      <path d="M8.5 16.43a5 5 0 0 1 7 0" />
      <path d="M12 20h.01" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      width="26"
      height="15"
      viewBox="0 0 28 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="1" y="3" width="20" height="10" rx="2.5" />
      <path d="M24 6.2v3.6" />
      <rect x="3.2" y="5" width="12" height="6" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MenuBar() {
  const { locale } = useI18n();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000 * 30); // recale au plus tard à la demi-minute
    return () => clearInterval(id);
  }, []);

  const intl = localeToIntl(locale);

  return (
    <div className="absolute inset-x-0 top-0 z-20 flex h-8 items-center gap-4 border-b border-white/10 bg-[#14161C]/60 px-4 text-[13px] text-white/80 backdrop-blur-md">
      <span
        className="h-3 w-3 rounded-full"
        style={{ background: COLORS.menubarDot }}
      />
      <span className="font-semibold text-white">adib.os</span>
      <span className="ml-auto flex items-center gap-3.5 text-white/75">
        <LanguageMenu />
        <WifiIcon />
        <VolumeIcon />
        <BatteryIcon />
        <span
          className="ml-1 font-mono text-[12px] tabular-nums"
          suppressHydrationWarning
        >
          {now ? `${formatDate(now, intl)}  ${formatClock(now, intl)}` : "—  --:--"}
        </span>
      </span>
    </div>
  );
}
