// Registre contenu : fait le pont entre un appId (que le moteur de fenêtres manipule) et son
// titre + son composant d'intérieur. Le moteur ne connaît rien des contenus ; il lit ce map.
import type { ComponentType } from "react";
import type { MessageKey } from "@/lib/i18n";
import { FinderApp } from "./FinderApp";
import { PlaceholderApp } from "./PlaceholderApp";

export type AppEntry = { titleKey: MessageKey; Component: ComponentType };

export const APP_REGISTRY: Record<string, AppEntry> = {
  finder: { titleKey: "window.projects", Component: FinderApp },
  apropos: { titleKey: "app.about", Component: PlaceholderApp },
  cv: { titleKey: "app.cv", Component: PlaceholderApp },
  contact: { titleKey: "app.contact", Component: PlaceholderApp },
};
