"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { DOCK_GROUPS, type DockApp } from "@/lib/apps";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useWindows } from "@/components/windows/WindowProvider";
import { useDockIcons } from "@/components/windows/DockIcons";

// Pastille de notif iOS : cercle rouge net qui pulse pour attirer l'œil (cf. maquette).
function Notif({ count }: { count: number }) {
  return (
    <span
      className="absolute -right-1.5 -top-1.5 z-10 flex h-[21px] w-[21px] items-center justify-center rounded-full text-[11px] font-extrabold leading-none tracking-[-0.03em] text-white"
      style={{
        background: "radial-gradient(circle at 50% 32%, #ff6b61, #ff3b30 72%)",
        animation: "notifBlink 1.4s ease-in-out infinite",
      }}
    >
      {count}
    </span>
  );
}

function DockItem({
  app,
  badge,
  running,
  onActivate,
}: {
  app: DockApp;
  badge?: number;
  running?: boolean;
  onActivate: () => void;
}) {
  const { t } = useI18n();
  const { register } = useDockIcons();
  const interactive = Boolean(app.opensWindow);
  // Callback stable → l'icône est enregistrée une seule fois (cible fiable du genie).
  const setIconRef = useCallback(
    (el: HTMLElement | null) => register(app.id, el),
    [register, app.id],
  );

  return (
    <motion.button
      type="button"
      onClick={onActivate}
      className="text-center"
      style={{ cursor: interactive ? "pointer" : "default" }}
      whileHover={{ y: -8, scale: 1.08 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {/* ref enregistrée pour le moteur de fenêtres : cible du vol « genie » à la réduction. */}
      <div ref={setIconRef} className="relative h-14 w-14">
        {app.image ? (
          <Image
            src={app.image}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 drop-shadow-[0_8px_18px_rgba(0,0,0,.5)]"
          />
        ) : (
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-[15px] font-mono font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_8px_18px_-8px_rgba(0,0,0,.7)] ${
              app.mono ? "text-[17px]" : "text-xl"
            }`}
            style={{ background: app.color }}
          >
            {app.glyph}
          </div>
        )}
        {badge != null && <Notif count={badge} />}
      </div>
      {/* Point « app lancée » (macOS) : allumé tant qu'une fenêtre de l'app existe. */}
      <div className="mt-1.5 flex h-1 items-center justify-center">
        {running && <span className="h-1 w-1 rounded-full bg-white/90" />}
      </div>
      <div className="mt-1 font-mono text-[10.5px] text-[#cdd2dd]">{t(app.labelKey)}</div>
    </motion.button>
  );
}

export function Dock() {
  const { open, windows } = useWindows();
  // Notif effacée dès la 1re ouverture du Finder (persistance localStorage → itér. 3).
  const [notifSeen, setNotifSeen] = useState(false);
  // Une app est « lancée » dès qu'une de ses fenêtres existe (normale, plein écran ou réduite).
  const openIds = new Set(windows.map((w) => w.appId));

  const activate = (app: DockApp) => {
    if (!app.opensWindow) return;
    if (app.badge != null) setNotifSeen(true);
    open(app.id);
  };

  return (
    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-end gap-3 rounded-[24px] border border-white/15 bg-[#22252D]/55 px-3 py-2.5 backdrop-blur-xl">
      {DOCK_GROUPS.map((group, i) => (
        <div key={i} className="flex items-end gap-3">
          {i > 0 && <span className="mx-1 h-12 w-px self-center bg-white/15" />}
          {group.map((app) => (
            <DockItem
              key={app.id}
              app={app}
              badge={app.badge != null && !notifSeen ? app.badge : undefined}
              running={openIds.has(app.id)}
              onActivate={() => activate(app)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
