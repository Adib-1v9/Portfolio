"use client";

// Les 3 feux macOS. Au survol du groupe, chaque pastille révèle son glyphe (× – +),
// exactement comme le Finder. stopPropagation : cliquer un feu ne doit pas déclencher le
// focus de la fenêtre (mousedown parent).
import { COLORS } from "@/lib/theme";

type Props = {
  onClose: () => void;
  onMinimize: () => void;
  onToggleFullscreen: () => void;
};

export function TrafficLights({ onClose, onMinimize, onToggleFullscreen }: Props) {
  const lights = [
    { color: COLORS.trafficRed, glyph: "×", label: "Fermer", onClick: onClose },
    { color: COLORS.trafficYellow, glyph: "–", label: "Réduire", onClick: onMinimize },
    { color: COLORS.trafficGreen, glyph: "+", label: "Plein écran", onClick: onToggleFullscreen },
  ];

  return (
    <div className="group flex gap-[7px]">
      {lights.map((l) => (
        <button
          key={l.label}
          type="button"
          aria-label={l.label}
          // padding + marge négative = zone cliquable agrandie (≈24px) sans décaler le rendu ;
          // stopPropagation pointerdown = un clic sur un feu ne démarre jamais le drag du header.
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            l.onClick();
          }}
          className="-mx-1 -my-1.5 flex cursor-pointer items-center justify-center rounded-full px-1 py-1.5"
        >
          <span
            className="flex h-3 w-3 items-center justify-center rounded-full text-[10px] font-bold leading-none text-black/60"
            style={{ background: l.color }}
          >
            <span className="opacity-0 transition-opacity group-hover:opacity-100">
              {l.glyph}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
