// Roster projets — PLACEHOLDER d'itér. 2. Le contenu réel (récits 1re personne, stacks,
// « lançable ou pas », repos privés) viendra APRÈS la curation GitHub. On ne stocke ici que
// des faits structurels neutres : le récit affiché reste la chaîne i18n placeholder, pour ne
// rien inventer qui pourrait être livré par erreur. Les NOMS sont des noms propres : JAMAIS
// traduits. Les CATÉGORIES, elles, sont des clés i18n.
import type { MessageKey } from "@/lib/i18n";
import type { GlyphKey } from "@/lib/projectGlyphs";

export type ProjectCategory = "games" | "bots" | "web" | "ext";

export type Project = {
  id: string;
  name: string; // nom propre, littéral
  category: ProjectCategory;
  icon: GlyphKey; // picto Phosphor (squircle graphite) — MÊME icône au bureau et dans le Finder
  color: string;
  descKey: MessageKey; // description i18n (traduite) ; affichée au Finder ET dans la fenêtre
  techKey: MessageKey; // détails techniques i18n ; affichés via le bouton « Détails techniques »
  repoUrl?: string; // « Voir le code » : seulement pour les repos publics
  shots?: string[]; // captures WebP optimisées (public/shots/…) ; carrousel si > 1, vide = placeholder
};

export const CATEGORY_LABEL: Record<ProjectCategory, MessageKey> = {
  games: "finder.cat.games",
  bots: "finder.cat.bots",
  web: "finder.cat.web",
  ext: "finder.cat.ext",
};

const GH = "https://github.com/Adib-1v9";

// Jeux → tous le picto « manette » (game-controller), distingués par la couleur.
// Bots → tous le picto « robot », distingués par la couleur.
// L'extension web (BombParty) prend « puzzle-piece » (icône classique des extensions), pas une bombe.
export const PROJECTS: Project[] = [
  { id: "gachanime", name: "Gachanime", category: "games", icon: "game-controller", color: "#2E8BFF", descKey: "proj.gachanime.desc", techKey: "proj.gachanime.tech", shots: ["/shots/gachanime-1.webp", "/shots/gachanime-2.webp", "/shots/gachanime-3.webp"] },
  { id: "starbucks-legacy", name: "Starbucks Legacy", category: "games", icon: "game-controller", color: "#30D158", descKey: "proj.starbucks-legacy.desc", techKey: "proj.starbucks-legacy.tech", repoUrl: `${GH}/Starbucks-Legacy`, shots: ["/shots/starbucks-legacy-1.webp", "/shots/starbucks-legacy-2.webp", "/shots/starbucks-legacy-3.webp"] },
  { id: "notagain", name: "notagain", category: "games", icon: "game-controller", color: "#FF9F0A", descKey: "proj.notagain.desc", techKey: "proj.notagain.tech", repoUrl: `${GH}/notagain` },
  { id: "sagwa-bot", name: "sagwa-bot", category: "bots", icon: "robot", color: "#5E5CE6", descKey: "proj.sagwa-bot.desc", techKey: "proj.sagwa-bot.tech", repoUrl: `${GH}/sagwa-discord-bot` },
  { id: "ckd-bot", name: "Ckd-Bot", category: "bots", icon: "robot", color: "#FF453A", descKey: "proj.ckd-bot.desc", techKey: "proj.ckd-bot.tech", repoUrl: `${GH}/Ckd-Bot` },
  { id: "spotify-stats", name: "Spotify Stats", category: "web", icon: "chart-bar", color: "#1DB954", descKey: "proj.spotify-stats.desc", techKey: "proj.spotify-stats.tech", repoUrl: `${GH}/Spotify-Stats`, shots: ["/shots/spotify-stats-1.webp", "/shots/spotify-stats-2.webp"] },
  { id: "weather", name: "Weather App", category: "web", icon: "cloud-sun", color: "#34C7DE", descKey: "proj.weather.desc", techKey: "proj.weather.tech", repoUrl: `${GH}/Weather_app`, shots: ["/shots/weather-1.webp", "/shots/weather-2.webp"] },
  { id: "bombparty", name: "BombParty Solver", category: "ext", icon: "puzzle-piece", color: "#FEBC2E", descKey: "proj.bombparty.desc", techKey: "proj.bombparty.tech", repoUrl: `${GH}/Bomb-Party-Solver-Extension`, shots: ["/shots/bombparty-1.webp"] },
];

// Une fenêtre de projet est une fenêtre du moteur dont l'appId est préfixé : le moteur reste
// agnostique, et WindowLayer/le bureau résolvent ce préfixe vers le projet correspondant.
const PROJECT_WIN_PREFIX = "proj:";

export function projectWindowId(projectId: string): string {
  return PROJECT_WIN_PREFIX + projectId;
}

export function findProjectByWindowId(windowId: string): Project | undefined {
  if (!windowId.startsWith(PROJECT_WIN_PREFIX)) return undefined;
  const id = windowId.slice(PROJECT_WIN_PREFIX.length);
  return PROJECTS.find((p) => p.id === id);
}
