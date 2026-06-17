// Constantes de la palette Graphite (source : maquette os-color-worlds.html, world A).
export const COLORS = {
  menubarDot: "#2E8BFF",
  // Feux de circulation macOS (fermer / réduire / plein écran).
  trafficRed: "#FF5F57",
  trafficYellow: "#FEBC2E",
  trafficGreen: "#28C840",
  // Bleu de sélection (listes Finder) + accents DA.
  selection: "#2E8BFF",
  accentBlue: "#2E8BFF",
  accentGreen: "#30D158",
  accentCyan: "#34C7DE",
  accentOrange: "#FF9F0A",
  accentRed: "#FF453A",
} as const;

// Catalogue des fonds d'écran disponibles (servis depuis public/wallpapers/, en WebP
// optimisé ~35-43 Ko). L'itération 3 (terminal) lira/écrira la clé choisie dans un store
// localStorage pour la rendre modifiable, sans toucher à la lecture côté Desktop.
export const WALLPAPERS = {
  "monterey-dark": "/wallpapers/monterey-dark.webp",
  "big-sur-night": "/wallpapers/big-sur-night.webp",
  "monterey-light": "/wallpapers/monterey-light.webp",
  "big-sur-day": "/wallpapers/big-sur-day.webp",
} as const;

export type WallpaperId = keyof typeof WALLPAPERS;

// Variante sombre par défaut : cohérent avec l'identité Graphite. La couleur #11141a sert
// de fallback (affichée le temps que l'image WebP charge, ou si elle échoue).
export const DEFAULT_WALLPAPER_ID: WallpaperId = "monterey-dark";

// Construit la valeur CSS `background` (shorthand) pour un fond : couleur de repli + image
// centrée et couvrante. Pure → testable, réutilisable par le futur sélecteur de fond.
export function wallpaperBackground(id: WallpaperId): string {
  return `#11141a url('${WALLPAPERS[id]}') center / cover no-repeat`;
}

export const DEFAULT_WALLPAPER = wallpaperBackground(DEFAULT_WALLPAPER_ID);

// Locale d'affichage de l'horloge/date. Centralisée ici : quand on branchera l'i18n
// (auto par locale navigateur + override discret), il suffira de passer la locale choisie.
export const CLOCK_LOCALE = "en-US";

// Helper pur : formate une Date en heure (ex. "9:41 AM"). Isolé pour testabilité.
export function formatClock(date: Date, locale: string = CLOCK_LOCALE): string {
  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Helper pur : formate une Date en "Mon Jun 16" (façon menubar macOS).
export function formatDate(date: Date, locale: string = CLOCK_LOCALE): string {
  return date.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
