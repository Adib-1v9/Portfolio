"use client";

// Gestionnaire central des fenêtres (Option A du design itér. 2). Le moteur ne connaît
// rien des contenus : il manipule des appId, le registre fait le pont vers le contenu.
import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";

export type WindowStatus = "normal" | "minimized" | "fullscreen";

export type WindowState = {
  appId: string;
  status: WindowStatus;
  z: number; // ordre d'empilement : plus grand = au-dessus
};

type State = { windows: WindowState[]; nextZ: number };

type Action =
  | { type: "open"; appId: string }
  | { type: "close"; appId: string }
  | { type: "minimize"; appId: string }
  | { type: "toggleFullscreen"; appId: string }
  | { type: "focus"; appId: string };

// Une seule fenêtre par app (clé = appId) : ouvrir une app déjà ouverte la ramène au
// premier plan et la restaure si elle était réduite.
function reducer(state: State, action: Action): State {
  const { windows, nextZ } = state;
  const existing = windows.find((w) => w.appId === action.appId);

  switch (action.type) {
    case "open": {
      if (existing) {
        return {
          nextZ: nextZ + 1,
          windows: windows.map((w) =>
            w.appId === action.appId ? { ...w, status: "normal", z: nextZ } : w,
          ),
        };
      }
      return {
        nextZ: nextZ + 1,
        windows: [...windows, { appId: action.appId, status: "normal", z: nextZ }],
      };
    }
    case "close":
      return { ...state, windows: windows.filter((w) => w.appId !== action.appId) };
    case "minimize":
      return {
        ...state,
        windows: windows.map((w) =>
          w.appId === action.appId ? { ...w, status: "minimized" } : w,
        ),
      };
    case "toggleFullscreen":
      return {
        ...state,
        windows: windows.map((w) =>
          w.appId === action.appId
            ? { ...w, status: w.status === "fullscreen" ? "normal" : "fullscreen" }
            : w,
        ),
      };
    case "focus": {
      if (!existing || existing.z === nextZ - 1) return state; // déjà au premier plan
      return {
        nextZ: nextZ + 1,
        windows: windows.map((w) => (w.appId === action.appId ? { ...w, z: nextZ } : w)),
      };
    }
    default:
      return state;
  }
}

type WindowContextValue = {
  windows: WindowState[];
  open: (appId: string) => void;
  close: (appId: string) => void;
  minimize: (appId: string) => void;
  toggleFullscreen: (appId: string) => void;
  focus: (appId: string) => void;
};

const WindowContext = createContext<WindowContextValue | null>(null);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], nextZ: 1 });

  // dispatch est stable ; on ne recalcule la valeur que quand la liste change.
  const value = useMemo<WindowContextValue>(
    () => ({
      windows: state.windows,
      open: (appId) => dispatch({ type: "open", appId }),
      close: (appId) => dispatch({ type: "close", appId }),
      minimize: (appId) => dispatch({ type: "minimize", appId }),
      toggleFullscreen: (appId) => dispatch({ type: "toggleFullscreen", appId }),
      focus: (appId) => dispatch({ type: "focus", appId }),
    }),
    [state.windows],
  );

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}

export function useWindows(): WindowContextValue {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be used within a WindowProvider");
  return ctx;
}
