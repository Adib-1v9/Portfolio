"use client";

// Couche de rendu des fenêtres : lit l'état du moteur et monte une <Window> par app ouverte.
// Les réduites RESTENT montées (juste pliées + invisibles) pour conserver leur état React
// (scroll, filtre) → restauration fidèle. AnimatePresence ne sert qu'à la fermeture (feu rouge).
// Le titre et le contenu viennent du registre, indexé par appId.
import { AnimatePresence } from "framer-motion";
import { APP_REGISTRY } from "@/components/apps/registry";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Window } from "./Window";
import { useWindows } from "./WindowProvider";

export function WindowLayer() {
  const { windows } = useWindows();
  const { t } = useI18n();

  // Contexte d'empilement fixe (z-15) : au-dessus des icônes du bureau (z-10) mais TOUJOURS
  // sous la menubar et le dock (z-20), quelle que soit la valeur de z des fenêtres entre elles.
  return (
    <div className="pointer-events-none absolute inset-0 z-[15]">
      <AnimatePresence>
        {windows.map((w) => {
          const entry = APP_REGISTRY[w.appId];
          if (!entry) return null;
          const { titleKey, Component } = entry;
          return (
            <Window key={w.appId} state={w} title={t(titleKey)}>
              <Component />
            </Window>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
