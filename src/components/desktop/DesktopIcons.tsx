"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { DESKTOP_ICONS, desktopScatterPositions } from "@/lib/apps";
import { projectWindowId } from "@/lib/projects";
import { useWindows } from "@/components/windows/WindowProvider";
import { ProjectGlyph } from "./ProjectGlyph";

// Icônes de projets éparpillées sur le bureau (squircle graphite + glyphe coloré).
// Interactions « macOS » : double-clic = ouvre la fenêtre du projet ; maintien + glissé =
// déplace ; simple clic = rien. Le curseur reste la flèche par défaut au survol (cursor-default
// + select-none). Le conteneur laisse passer les clics du vide (pointer-events-none) ; seules
// les icônes captent les événements (pointer-events-auto).
export function DesktopIcons() {
  const { open } = useWindows();
  const containerRef = useRef<HTMLDivElement>(null);
  const positions = desktopScatterPositions(DESKTOP_ICONS.length);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-10">
      {DESKTOP_ICONS.map((icon, i) => (
        <motion.div
          key={icon.id}
          drag
          dragConstraints={containerRef}
          dragMomentum={false}
          dragElastic={0.12}
          whileDrag={{ scale: 1.04 }}
          onDoubleClick={() => open(projectWindowId(icon.id))}
          className="pointer-events-auto absolute w-24 cursor-default select-none text-center"
          style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
        >
          <div
            className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(160deg,#262932,#1b1d24)] shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_10px_20px_-10px_rgba(0,0,0,.6)]"
            style={{ color: icon.color }}
          >
            <ProjectGlyph name={icon.icon} className="h-[30px] w-[30px]" />
          </div>
          <div className="mt-2 text-[12px] text-[#cfd4de] [text-shadow:0_1px_3px_rgba(0,0,0,.7)]">
            {icon.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
