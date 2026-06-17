// Registre d'apps : SOURCE UNIQUE. Le dock et le moteur de fenêtres lisent ce tableau.
import type { MessageKey } from "@/lib/i18n";
import { PROJECTS } from "@/lib/projects";
import type { GlyphKey } from "@/lib/projectGlyphs";

// App du dock = élément d'interface → son libellé est une clé i18n (traduit).
export type DockApp = {
  id: string;
  labelKey: MessageKey;
  glyph?: string; // caractère/emoji affiché (si pas d'image)
  color?: string; // fond de l'icône (si pas d'image)
  image?: string; // chemin d'une vraie icône (prioritaire sur glyph)
  mono?: boolean; // true = glyph rendu en plus petit (style ">_")
  opensWindow?: boolean; // true = un clic ouvre une fenêtre (sinon icône inerte)
  badge?: number; // pastille de notification (ex. Finder = 10 projets)
};

// Icône bureau = un projet → son nom est un nom propre, JAMAIS traduit (label littéral).
// icon = picto Phosphor inliné, color = sa teinte. La position n'est PAS stockée : elle est
// calculée en cercle autour du centre (cf. desktopRingPositions) → toujours équilibrée quel
// que soit le nombre d'icônes. Non déplaçables.
export type DesktopIcon = {
  id: string;
  label: string;
  icon: GlyphKey;
  color: string;
};

const FINDER: DockApp = {
  id: "finder",
  labelKey: "app.finder",
  image: "/finder.png",
  opensWindow: true,
  badge: PROJECTS.length, // la pastille reflète le nombre réel de projets du catalogue
};
const TERMINAL: DockApp = {
  // Inerte jusqu'à l'itération 3 (terminal scripté) → pas de opensWindow.
  id: "terminal",
  labelKey: "app.terminal",
  glyph: ">_",
  color: "#16181E",
  mono: true,
};
const ABOUT: DockApp = { id: "apropos", labelKey: "app.about", glyph: "i", color: "#FF9F0A", opensWindow: true };
const CV: DockApp = { id: "cv", labelKey: "app.cv", glyph: "▢", color: "#FF453A", opensWindow: true };
const CONTACT: DockApp = { id: "contact", labelKey: "app.contact", glyph: "@", color: "#34C7DE", opensWindow: true };

// Disposition du dock (Option A) : Finder ancré à gauche | apps « moi » | Terminal isolé.
// Chaque sous-tableau = un groupe ; un séparateur est rendu entre les groupes.
export const DOCK_GROUPS: DockApp[][] = [[FINDER], [ABOUT, CV, CONTACT], [TERMINAL]];

// Liste à plat (lookup par id côté moteur de fenêtres).
export const APPS: DockApp[] = DOCK_GROUPS.flat();

export function findApp(id: string): DockApp | undefined {
  return APPS.find((a) => a.id === id);
}

// Vitrine du bureau : les projets phares, chacun visuellement distinct. Non cliquables pour
// l'instant (la cliquabilité viendra ensuite). L'ordre fixe l'angle de chacun sur le cercle.
export const DESKTOP_ICONS: DesktopIcon[] = [
  { id: "gachanime", label: "Gachanime", icon: "dice-five", color: "#3B9EFF" },
  { id: "starbucks-legacy", label: "Starbucks Legacy", icon: "coffee", color: "#00B873" },
  { id: "spotify-stats", label: "Spotify Stats", icon: "chart-bar", color: "#1ED760" },
  { id: "sagwa-bot", label: "sagwa-bot", icon: "robot", color: "#8C8AFF" },
];

// Dispose `count` icônes en cercle autour du centre (milieu laissé libre pour la future fenêtre
// d'accueil). Coordonnées = % du viewport (coin haut-gauche de la boîte de 96px).
// - ry (rayon vertical) grandit avec le nombre d'icônes → cercle « plus ou moins grand ».
// - rx ≈ 0.6·ry compense l'écran plus large que haut → rendu visuellement circulaire (pas ovale).
// - premier élément placé en haut (-90°), puis répartition régulière dans le sens horaire.
export function desktopRingPositions(count: number): { x: number; y: number }[] {
  const cx = 43;
  const cy = 40;
  const ry = 16 + count * 2;
  const rx = ry * 0.6;
  return Array.from({ length: count }, (_, i) => {
    const a = ((-90 + (360 / count) * i) * Math.PI) / 180;
    return {
      x: +(cx + rx * Math.cos(a)).toFixed(1),
      y: +(cy + ry * Math.sin(a)).toFixed(1),
    };
  });
}
