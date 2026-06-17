// Roster projets — PLACEHOLDER d'itér. 2. Le contenu réel (récits 1re personne, stacks,
// « lançable ou pas », repos privés) viendra APRÈS la curation GitHub. On ne stocke ici que
// des faits structurels neutres : le récit affiché reste la chaîne i18n placeholder, pour ne
// rien inventer qui pourrait être livré par erreur. Les NOMS sont des noms propres : JAMAIS
// traduits. Les CATÉGORIES, elles, sont des clés i18n.
import type { MessageKey } from "@/lib/i18n";

export type ProjectCategory = "games" | "bots" | "web" | "ext";

export type Project = {
  id: string;
  name: string; // nom propre, littéral
  category: ProjectCategory;
  glyph: string;
  color: string;
  launchable: boolean; // ▶ Lancer actif seulement si l'app tourne dans l'OS (itér. ≥ 3)
  repoUrl?: string; // « Voir le code » : seulement pour les repos publics
};

export const CATEGORY_LABEL: Record<ProjectCategory, MessageKey> = {
  games: "finder.cat.games",
  bots: "finder.cat.bots",
  web: "finder.cat.web",
  ext: "finder.cat.ext",
};

const GH = "https://github.com/Adib-1v9";

export const PROJECTS: Project[] = [
  { id: "gachanime", name: "Gachanime", category: "games", glyph: "G", color: "#2E8BFF", launchable: false },
  { id: "starbucks-legacy", name: "Starbucks Legacy", category: "games", glyph: "S", color: "#30D158", launchable: false, repoUrl: `${GH}/Starbucks-Legacy` },
  { id: "notagain", name: "notagain", category: "games", glyph: "N", color: "#FF9F0A", launchable: false, repoUrl: `${GH}/notagain` },
  { id: "sagwa-bot", name: "sagwa-bot", category: "bots", glyph: "◆", color: "#5E5CE6", launchable: false, repoUrl: `${GH}/sagwa-discord-bot` },
  { id: "ckd-bot", name: "Ckd-Bot", category: "bots", glyph: "C", color: "#FF453A", launchable: false, repoUrl: `${GH}/Ckd-Bot` },
  { id: "spotify-stats", name: "Spotify Stats", category: "web", glyph: "♫", color: "#1DB954", launchable: false, repoUrl: `${GH}/Spotify-Stats` },
  { id: "weather", name: "Weather App", category: "web", glyph: "☁", color: "#34C7DE", launchable: false, repoUrl: `${GH}/Weather_app` },
  { id: "bombparty", name: "BombParty Solver", category: "ext", glyph: "B", color: "#FEBC2E", launchable: false, repoUrl: `${GH}/Bomb-Party-Solver-Extension` },
];
