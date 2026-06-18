"use client";

// Carrousel des captures d'un projet, rendu dans la surface d'aperçu (58%) d'AppShell.
// Une seule image → affichage simple. Plusieurs → flèches prev/next + pastilles, crossfade léger.
// On garde l'emplacement d'origine (le grand cadre dégradé qui remplit le panneau) + object-cover :
// les captures sont prises AU FORMAT de cette zone (~1:1) via tools/studio.html → elles la remplissent pile.
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// Carets Phosphor (regular) inlinés — même parti pris que projectGlyphs : aucune dépendance d'icônes.
const CARET_LEFT =
  "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z";
const CARET_RIGHT =
  "M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z";

function Caret({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 256 256" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function ProjectCarousel({
  shots,
  name,
  color,
}: {
  shots: string[];
  name: string;
  color: string;
}) {
  const [i, setI] = useState(0);
  const many = shots.length > 1;
  const go = (next: number) => setI((next + shots.length) % shots.length);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[12px] border border-white/[0.08] [background:radial-gradient(120%_120%_at_30%_10%,#1b2030,#0d0f15_70%)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={shots[i]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="relative h-full w-full p-[14px]"
        >
          <Image
            src={shots[i]}
            alt={`${name} ${i + 1}/${shots.length}`}
            fill
            sizes="(max-width: 768px) 90vw, 45vw"
            // Les captures sont déjà des WebP finalisées (taille + compression gérées par tools/studio.html).
            // unoptimized = servies telles quelles, sans la recompression Next (qualité 75) qui les pixelisait.
            unoptimized
            style={{ objectFit: "cover" }}
            className="rounded-[8px]"
          />
        </motion.div>
      </AnimatePresence>

      {many && (
        <>
          <button
            type="button"
            onClick={() => go(i - 1)}
            aria-label="Image précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/40 text-white/90 backdrop-blur transition hover:bg-black/60"
          >
            <Caret d={CARET_LEFT} />
          </button>
          <button
            type="button"
            onClick={() => go(i + 1)}
            aria-label="Image suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/40 text-white/90 backdrop-blur transition hover:bg-black/60"
          >
            <Caret d={CARET_RIGHT} />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {shots.map((s, n) => (
              <button
                key={s}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Aller à l'image ${n + 1}`}
                className="h-[7px] rounded-full transition-all"
                style={{
                  width: n === i ? 18 : 7,
                  background: n === i ? color : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
