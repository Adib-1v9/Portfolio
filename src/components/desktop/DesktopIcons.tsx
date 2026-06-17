import { DESKTOP_ICONS, desktopRingPositions } from "@/lib/apps";
import { ProjectGlyph } from "./ProjectGlyph";

// Conteneur « Graphite » : squircle verre sombre, glyphe coloré. Non déplaçable / non cliquable.
// Positions calculées en cercle autour du centre (rayon ∝ nombre d'icônes).
export function DesktopIcons() {
  const ring = desktopRingPositions(DESKTOP_ICONS.length);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      {DESKTOP_ICONS.map((icon, i) => (
        <div
          key={icon.id}
          className="absolute w-24 text-center"
          style={{ left: `${ring[i].x}%`, top: `${ring[i].y}%` }}
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
        </div>
      ))}
    </div>
  );
}
