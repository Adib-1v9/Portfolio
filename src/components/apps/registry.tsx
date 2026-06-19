// Registre contenu : fait le pont entre un appId (que le moteur de fenêtres manipule) et son
// titre + son composant d'intérieur. Le moteur ne connaît rien des contenus ; il lit ce map.
import type { ComponentType } from "react";
import { findApp } from "@/lib/apps";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type { MessageKey } from "@/lib/i18n";
import { AppShell } from "./AppShell";
import { FinderApp } from "./FinderApp";
import { ContactApp } from "./ContactApp";

export type AppEntry = { titleKey: MessageKey; Component: ComponentType };

// Applis système « simples » (À propos / CV) : même layout que les projets via AppShell.
// Icône + accent DÉRIVÉS de apps.ts (source unique) → dock et fenêtre ne peuvent pas diverger.
// La descKey est passée explicitement par appId pour garder le typage MessageKey strict.
function systemApp(id: string, descKey: MessageKey): ComponentType {
  const app = findApp(id);
  if (!app?.icon || !app.color) {
    throw new Error(`systemApp: config d'icône manquante pour "${id}" dans apps.ts`);
  }
  const { icon, color, labelKey } = app;
  // Le CV garde le split + son panneau aperçu (un aperçu du CV y viendra) ; À propos n'a rien
  // de visuel à montrer → vue centrée plein cadre (comme un projet sans capture).
  const reservePreview = id === "cv";
  return function SystemApp() {
    const { t } = useI18n();
    return (
      <AppShell
        icon={icon}
        color={color}
        name={t(labelKey)}
        fill
        descKey={descKey}
        reservePreview={reservePreview}
      />
    );
  };
}

export const APP_REGISTRY: Record<string, AppEntry> = {
  finder: { titleKey: "window.projects", Component: FinderApp },
  apropos: { titleKey: "app.about", Component: systemApp("apropos", "apropos.intro") },
  cv: { titleKey: "app.cv", Component: systemApp("cv", "cv.intro") },
  contact: { titleKey: "app.contact", Component: ContactApp },
};
