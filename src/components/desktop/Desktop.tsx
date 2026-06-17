"use client";

import { DEFAULT_WALLPAPER } from "@/lib/theme";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { DesktopIcons } from "./DesktopIcons";
import { SmallScreenNotice, useIsDesktop } from "./SmallScreenGate";
import { WindowProvider } from "@/components/windows/WindowProvider";
import { WindowLayer } from "@/components/windows/WindowLayer";
import { DockIconsProvider } from "@/components/windows/DockIcons";

export function Desktop() {
  const isDesktop = useIsDesktop();

  return (
    <main
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: DEFAULT_WALLPAPER }}
    >
      {isDesktop === false ? (
        <SmallScreenNotice />
      ) : (
        // Les providers englobent le dock (qui ouvre les fenêtres + expose la position de ses
        // icônes) ET la couche de rendu (qui lit l'état + la géométrie du dock pour le genie).
        <WindowProvider>
          <DockIconsProvider>
            <MenuBar />
            <DesktopIcons />
            <WindowLayer />
            <Dock />
          </DockIconsProvider>
        </WindowProvider>
      )}
    </main>
  );
}
