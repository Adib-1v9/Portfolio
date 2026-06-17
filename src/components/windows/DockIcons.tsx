"use client";

// Registre de géométrie du dock : associe un appId à l'élément DOM de son icône. Sert au moteur
// de fenêtres pour calculer la cible du « genie » (vol de la fenêtre vers SON icône à la
// réduction). Basé sur un ref (Map) → aucun re-render quand une icône s'enregistre/se mesure.
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type DockIconsValue = {
  register: (appId: string, el: HTMLElement | null) => void;
  get: (appId: string) => HTMLElement | null;
};

const DockIconsContext = createContext<DockIconsValue | null>(null);

export function DockIconsProvider({ children }: { children: ReactNode }) {
  const map = useRef(new Map<string, HTMLElement>());

  const register = useCallback((appId: string, el: HTMLElement | null) => {
    if (el) map.current.set(appId, el);
    else map.current.delete(appId);
  }, []);

  const get = useCallback((appId: string) => map.current.get(appId) ?? null, []);

  const value = useMemo<DockIconsValue>(() => ({ register, get }), [register, get]);

  return <DockIconsContext.Provider value={value}>{children}</DockIconsContext.Provider>;
}

export function useDockIcons(): DockIconsValue {
  const ctx = useContext(DockIconsContext);
  if (!ctx) throw new Error("useDockIcons must be used within a DockIconsProvider");
  return ctx;
}
