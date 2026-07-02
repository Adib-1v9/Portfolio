// Registre d'apps : SOURCE UNIQUE. Le dock et le moteur de fenêtres lisent ce tableau.
import type { MessageKey } from "@/lib/i18n";
import { PROJECTS } from "@/lib/projects";
import type { GlyphKey } from "@/lib/projectGlyphs";

// App du dock = élément d'interface → son libellé est une clé i18n (traduit).
export type DockApp = {
  id: string;
  labelKey: MessageKey;
  icon?: GlyphKey; // picto Phosphor (squircle graphite) — MÊME icône au dock et dans la fenêtre
  glyph?: string; // caractère/emoji affiché (repli, ex. Terminal ">_")
  color?: string; // teinte du glyphe (icon) ou fond (glyph caractère)
  image?: string; // chemin d'une vraie icône (prioritaire)
  mono?: boolean; // true = glyph rendu en plus petit (style ">_")
  opensWindow?: boolean; // true = un clic ouvre une fenêtre (sinon icône inerte)
  badge?: number; // pastille de notification (ex. Finder = 10 projets)
};

// Icône bureau = un projet → son nom est un nom propre, JAMAIS traduit (label littéral).
// icon = picto Phosphor inliné, color = sa teinte. La position n'est PAS stockée : elle est
// éparpillée (cf. desktopScatterPositions) pour un bureau vivant. Non déplaçables.
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
  id: "terminal",
  labelKey: "app.terminal",
  glyph: ">_",
  color: "#16181E",
  mono: true,
  opensWindow: true,
};
// Icône = MÊME picto Phosphor que l'en-tête de la fenêtre (cf. registry.tsx qui dérive d'ici) ;
// color = teinte du glyphe sur le squircle graphite, comme les projets.
const ABOUT: DockApp = { id: "apropos", labelKey: "app.about", icon: "user", color: "#FF9F0A", opensWindow: true };
const CV: DockApp = { id: "cv", labelKey: "app.cv", icon: "file-text", color: "#FF453A", opensWindow: true };
const CONTACT: DockApp = { id: "contact", labelKey: "app.contact", icon: "envelope", color: "#34C7DE", opensWindow: true };

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
// Projets mis en avant sur le bureau (sous-ensemble curé du catalogue). On les DÉRIVE de
// PROJECTS → l'icône et la couleur sont strictement les mêmes qu'au Finder (source unique).
const FEATURED_DESKTOP_IDS = ["gachanime", "starbucks-legacy", "spotify-stats", "sagwa-bot"];

export const DESKTOP_ICONS: DesktopIcon[] = FEATURED_DESKTOP_IDS.map((id) => {
  const p = PROJECTS.find((proj) => proj.id === id);
  if (!p) throw new Error(`DESKTOP_ICONS: projet inconnu "${id}"`);
  return { id: p.id, label: p.name, icon: p.icon, color: p.color };
});

// Positions « éparpillées » des icônes du bureau : un scatter volontairement asymétrique pour
// rendre le bureau vivant (≠ cercle géométrique, ≠ colonne alignée). Pool d'ancres curées
// (% du viewport, coin haut-gauche de la boîte de 96px) ; on prend les `count` premières.
// Choisies pour éviter la menubar (haut), le dock (bas-centre) et le centre (fenêtre d'accueil).
const SCATTER_ANCHORS = [
  { x: 11, y: 21 },
  { x: 79, y: 17 },
  { x: 63, y: 60 },
  { x: 17, y: 66 },
  { x: 85, y: 46 },
  { x: 37, y: 28 },
];

export function desktopScatterPositions(count: number): { x: number; y: number }[] {
  return SCATTER_ANCHORS.slice(0, count);
}
