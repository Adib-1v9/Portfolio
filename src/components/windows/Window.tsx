"use client";

// Châssis commun à toutes les fenêtres : barre de titre (feux + titre centré) + contenu.
// - Déplaçable par la barre de titre uniquement (comme macOS), avec débordement partiel hors écran.
// - Réduction « genie » : à la minimisation la fenêtre se plie en volant vers SON icône du dock
//   (translate x/y + scale + fondu) ; à la restauration l'animation est jouée à l'envers. La
//   fenêtre reste montée pendant ce temps → son état React est conservé.
// Le positionnement de base est délégué à un wrapper flex ; Framer garde le monopole de `transform`
// (drag x/y + scale d'ouverture/genie), sans conflit avec d'éventuels translate Tailwind.
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { TrafficLights } from "./TrafficLights";
import { useDockIcons } from "./DockIcons";
import { useWindows, type WindowState } from "./WindowProvider";

type Props = {
  state: WindowState;
  title: string;
  children: React.ReactNode;
};

// Courbe d'« aspiration » (easeIn) pour le pli ; ressort doux pour le déploiement/l'ouverture.
const FOLD_T = { duration: 0.34, ease: [0.4, 0, 1, 1] as const };
const SPRING_T = { type: "spring" as const, stiffness: 340, damping: 30 };
const SIZE_T = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }; // recentrage calé sur transition-[width,height]

export function Window({ state, title, children }: Props) {
  const { close, minimize, toggleFullscreen, focus } = useWindows();
  const { get: getDockIcon } = useDockIcons();
  const reduce = useReducedMotion();
  const isFull = state.status === "fullscreen";
  const isMin = state.status === "minimized";
  const draggable = !isMin; // déplaçable en normal ET en plein écran (glisser = restaurer)

  const containerRef = useRef<HTMLDivElement>(null); // borne du drag + centre de référence
  const sectionRef = useRef<HTMLElement>(null);
  const dragControls = useDragControls();
  // x/y = translation de la fenêtre (drag ET vol genie écrivent dans ces motion values).
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const placed = useRef({ x: 0, y: 0 }); // position avant réduction (pour restaurer au même endroit)
  const preFull = useRef({ x: 0, y: 0 }); // position avant plein écran (restaurée au retour)
  const restoreByDrag = useRef(false); // sortie de plein écran par glissé : x/y déjà posés sous le curseur
  const prevStatus = useRef(state.status);

  // Bornes du drag en pixels, relatives à la position centrée (x=y=0 = centré). freeX/freeY =
  // marge avant de toucher le bord en restant entièrement visible ; on y ajoute un débordement
  // autorisé (≈ moitié de la fenêtre sur les côtés / 45 % vers le bas) pour pouvoir « un peu »
  // la sortir de l'écran. Le haut reste borné à -freeY → la barre de titre ne passe jamais sous
  // la menubar (comportement macOS).
  const [bounds, setBounds] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const [foldScale, setFoldScale] = useState(0.08);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const recompute = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      // Taille NORMALE de la fenêtre (cf. className : w-[80%] min 600 max 1100, h-[78%] max 660).
      // Toujours calculée ainsi (même en plein écran) car le drag ne s'exerce qu'à taille normale.
      const winW = Math.min(Math.max(0.8 * cw, 600), 1100);
      const winH = Math.min(0.78 * ch, 660);
      const freeX = Math.max(0, (cw - winW) / 2);
      const freeY = Math.max(0, (ch - winH) / 2);
      setBounds({
        top: -freeY,
        bottom: freeY + winH * 0.45,
        left: -(freeX + winW * 0.5),
        right: freeX + winW * 0.5,
      });
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Pilote x/y aux transitions de statut : pli/déploiement genie (réduire) ET recentrage au
  // plein écran (sinon le décalage de drag persiste et la fenêtre ne couvre pas l'écran).
  useEffect(() => {
    const was = prevStatus.current;
    prevStatus.current = state.status;
    if (was === state.status) return;

    if (state.status === "minimized") {
      placed.current = { x: x.get(), y: y.get() }; // mémorise où la rouvrir
      if (reduce) return; // mouvement réduit : seul le fondu (géré par l'inner) joue
      const container = containerRef.current;
      const section = sectionRef.current;
      const icon = getDockIcon(state.appId);
      if (!container || !section || !icon) return;
      // Cible = centre de l'icône dock, exprimée comme translation depuis la position centrée
      // (x=y=0). Calcul fait depuis le conteneur (non animé) + offsetWidth (taille de layout,
      // insensible au scale déjà en cours) → indépendant de l'animation et du drag courant.
      const c = container.getBoundingClientRect();
      const tgt = icon.getBoundingClientRect();
      setFoldScale(Math.max(0.04, tgt.width / section.offsetWidth));
      animate(x, tgt.left + tgt.width / 2 - (c.left + c.width / 2), FOLD_T);
      animate(y, tgt.top + tgt.height / 2 - (c.top + c.height / 2), FOLD_T);
      return;
    }

    if (state.status === "fullscreen") {
      // Recentre (x=y=0) → la fenêtre couvre toute la zone, quel que soit le drag précédent.
      preFull.current = { x: x.get(), y: y.get() };
      animate(x, 0, SIZE_T);
      animate(y, 0, SIZE_T);
      return;
    }

    // → normal
    if (was === "minimized") {
      animate(x, placed.current.x, SPRING_T);
      animate(y, placed.current.y, SPRING_T);
    } else if (was === "fullscreen") {
      if (restoreByDrag.current) {
        restoreByDrag.current = false; // x/y déjà posés sous le curseur par le handler de drag
      } else {
        animate(x, preFull.current.x, SIZE_T); // bouton vert : retour à la position d'avant
        animate(y, preFull.current.y, SIZE_T);
      }
    }
  }, [state.status, reduce, getDockIcon, state.appId, x, y]);

  return (
    // Zone utile sous la menubar (top-8). pointer-events-none : les vides laissent passer le
    // clic vers le bureau. Ce wrapper sert aussi de borne au drag (dragConstraints).
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 top-8 flex items-center justify-center"
      style={{ zIndex: state.z }}
      aria-hidden={isMin}
    >
      <motion.section
        ref={sectionRef}
        role="dialog"
        aria-label={title}
        onMouseDown={() => focus(state.appId)}
        drag={draggable}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={bounds}
        dragElastic={0.06}
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: isMin ? 0 : 1, scale: isMin && !reduce ? foldScale : 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={isMin ? (reduce ? { duration: 0.18 } : FOLD_T) : SPRING_T}
        style={{ x, y, transformOrigin: "50% 50%", willChange: "transform" }}
        className={`flex flex-col overflow-hidden border border-white/[0.13] bg-[#1C1E25] shadow-[0_60px_120px_-40px_rgba(0,0,0,.92)] transition-[width,height,border-radius] duration-300 ${
          isMin ? "pointer-events-none" : "pointer-events-auto"
        } ${
          isFull
            ? "h-full w-full rounded-none"
            : "h-[78%] max-h-[660px] w-[80%] min-w-[600px] max-w-[1100px] rounded-[14px]"
        }`}
      >
        <header
          onPointerDown={(e) => {
            // Le drag ne part que de la barre de titre, jamais des feux.
            if (!draggable || (e.target as HTMLElement).closest("button")) return;
            // On n'arme le drag qu'après un vrai mouvement (seuil) : un simple clic ne fait rien
            // (laisse passer le double-clic), tenir+glisser déplace — et restaure si on était en
            // plein écran. Ce seuil est indispensable car restaurer a un effet de bord.
            const startX = e.clientX;
            const startY = e.clientY;
            const wasFull = isFull;
            function cleanup() {
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerup", cleanup);
            }
            function onMove(me: PointerEvent) {
              if (Math.hypot(me.clientX - startX, me.clientY - startY) < 5) return;
              cleanup();
              if (wasFull) {
                // Restaure la fenêtre sous le curseur avant de démarrer le geste (comme Windows).
                const c = containerRef.current?.getBoundingClientRect();
                if (c) {
                  const winH = Math.min(0.78 * c.height, 660); // hauteur normale (h-[78%] max 660px)
                  x.set(me.clientX - (c.left + c.width / 2));
                  y.set(me.clientY - (c.top + c.height / 2) + winH / 2 - 20);
                }
                restoreByDrag.current = true; // l'effet de statut ne doit PAS écraser ces x/y
                toggleFullscreen(state.appId);
              }
              // Démarrage du geste depuis l'événement de mouvement → reste collé au curseur.
              dragControls.start(me);
            }
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", cleanup);
          }}
          onDoubleClick={(e) => {
            // Double-clic sur la barre de titre = bascule plein écran ↔ normal (jamais sur les feux).
            if ((e.target as HTMLElement).closest("button")) return;
            toggleFullscreen(state.appId);
          }}
          className="relative flex cursor-grab select-none items-center gap-[9px] border-b border-white/[0.06] bg-[#23262F] px-3.5 py-[11px] active:cursor-grabbing"
        >
          <TrafficLights
            onClose={() => close(state.appId)}
            onMinimize={() => minimize(state.appId)}
            onToggleFullscreen={() => toggleFullscreen(state.appId)}
          />
          <span className="pointer-events-none absolute inset-x-0 text-center text-[12.5px] font-semibold text-[#cfd3da]">
            {title}
          </span>
        </header>
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </motion.section>
    </div>
  );
}
