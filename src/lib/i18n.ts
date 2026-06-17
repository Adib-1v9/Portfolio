// Cœur i18n. Détection auto (cookie → Accept-Language) côté serveur, override manuel
// persisté en cookie côté client. Volontairement maison (pas de lib) : peu de chaînes, et
// on garde la maîtrise du flux SSR pour éviter tout flash de langue au chargement.

export const LOCALES = ["fr", "en", "es", "de", "ar", "ja", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

// Repli quand ni cookie ni navigateur ne correspondent à une langue gérée.
export const DEFAULT_LOCALE: Locale = "en";

// Nom du cookie de persistance du choix manuel (lu côté serveur au prochain rendu).
export const LOCALE_COOKIE = "adibos.lang";

// Libellé court affiché dans la barre de menu. NB : c'est un libellé de PRÉSENTATION, pas
// le code de langue (qui reste ja/ko). On affiche le code pays usuel JP/KR, plus reconnu
// qu'un code langue pour un visiteur (drapeaux/domaines .jp .kr).
export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
  de: "DE",
  ar: "AR",
  ja: "JP",
  ko: "KR",
};
export const LOCALE_NAMES: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  ar: "العربية",
  ja: "日本語",
  ko: "한국어",
};

// Locale Intl complète par langue (pour formater l'horloge/la date).
const LOCALE_INTL: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
  ar: "ar",
  ja: "ja-JP",
  ko: "ko-KR",
};

// Langues écrites de droite à gauche → impose dir="rtl" sur <html>.
const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(["ar"]);

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

// Serveur : choisit la langue. Priorité au cookie (choix explicite), sinon on parcourt
// l'en-tête Accept-Language dans l'ordre de préférence du navigateur.
export function resolveLocale(
  cookieValue: string | undefined,
  acceptLanguage: string | null,
): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  const preferred = (acceptLanguage ?? "")
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase().split("-")[0]);
  for (const lang of preferred) if (isLocale(lang)) return lang;
  return DEFAULT_LOCALE;
}

// Mappe notre locale courte vers une locale Intl complète (pour l'horloge/la date).
export function localeToIntl(locale: Locale): string {
  return LOCALE_INTL[locale];
}

// Client : persiste le choix (cookie 1 an) et aligne <html lang>/<html dir> (accessibilité
// + sens de lecture RTL/LTR).
export function persistLocale(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
  document.documentElement.lang = locale;
  document.documentElement.dir = localeDir(locale);
}

// Dictionnaire. Les NOMS de projets (icônes bureau) ne sont pas ici : ce sont des noms
// propres, jamais traduits. Le terminal aura ses propres chaînes, toujours en anglais.
const dictionary = {
  fr: {
    "menu.go": "Aller",
    "menu.help": "Aide",
    "lang.title": "Langue",
    "app.finder": "Finder",
    "app.terminal": "Terminal",
    "app.about": "À propos",
    "app.cv": "CV",
    "app.contact": "Contact",
    "app.placeholder": "Contenu bientôt disponible.",
    "window.projects": "Projets",
    "finder.categories": "Catégories",
    "finder.cat.all": "Tout",
    "finder.cat.games": "Jeux",
    "finder.cat.bots": "Bots",
    "finder.cat.web": "Web",
    "finder.cat.ext": "Extensions",
    "finder.launch": "Lancer",
    "finder.viewCode": "Voir le code",
    "smallScreen.title": "adib.os s'ouvre sur ordinateur",
    "smallScreen.body":
      "Ce portfolio est un petit OS pensé pour le grand écran. Reviens depuis un ordinateur pour l'explorer.",
  },
  en: {
    "menu.go": "Go",
    "menu.help": "Help",
    "lang.title": "Language",
    "app.finder": "Finder",
    "app.terminal": "Terminal",
    "app.about": "About",
    "app.cv": "Resume",
    "app.contact": "Contact",
    "app.placeholder": "Content coming soon.",
    "window.projects": "Projects",
    "finder.categories": "Categories",
    "finder.cat.all": "All",
    "finder.cat.games": "Games",
    "finder.cat.bots": "Bots",
    "finder.cat.web": "Web",
    "finder.cat.ext": "Extensions",
    "finder.launch": "Launch",
    "finder.viewCode": "View code",
    "smallScreen.title": "adib.os opens on desktop",
    "smallScreen.body":
      "This portfolio is a little OS made for the big screen. Come back from a computer to explore it.",
  },
  es: {
    "menu.go": "Ir",
    "menu.help": "Ayuda",
    "lang.title": "Idioma",
    "app.finder": "Finder",
    "app.terminal": "Terminal",
    "app.about": "Sobre mí",
    "app.cv": "CV",
    "app.contact": "Contacto",
    "app.placeholder": "Contenido próximamente.",
    "window.projects": "Proyectos",
    "finder.categories": "Categorías",
    "finder.cat.all": "Todo",
    "finder.cat.games": "Juegos",
    "finder.cat.bots": "Bots",
    "finder.cat.web": "Web",
    "finder.cat.ext": "Extensiones",
    "finder.launch": "Abrir",
    "finder.viewCode": "Ver código",
    "smallScreen.title": "adib.os se abre en ordenador",
    "smallScreen.body":
      "Este portafolio es un pequeño SO pensado para pantallas grandes. Vuelve desde un ordenador para explorarlo.",
  },
  de: {
    "menu.go": "Gehe zu",
    "menu.help": "Hilfe",
    "lang.title": "Sprache",
    "app.finder": "Finder",
    "app.terminal": "Terminal",
    "app.about": "Über mich",
    "app.cv": "Lebenslauf",
    "app.contact": "Kontakt",
    "app.placeholder": "Inhalt folgt in Kürze.",
    "window.projects": "Projekte",
    "finder.categories": "Kategorien",
    "finder.cat.all": "Alle",
    "finder.cat.games": "Spiele",
    "finder.cat.bots": "Bots",
    "finder.cat.web": "Web",
    "finder.cat.ext": "Erweiterungen",
    "finder.launch": "Starten",
    "finder.viewCode": "Code ansehen",
    "smallScreen.title": "adib.os öffnet sich am Computer",
    "smallScreen.body":
      "Dieses Portfolio ist ein kleines OS für den großen Bildschirm. Komm von einem Computer zurück, um es zu erkunden.",
  },
  ar: {
    "menu.go": "انتقال",
    "menu.help": "مساعدة",
    "lang.title": "اللغة",
    "app.finder": "Finder",
    "app.terminal": "الطرفية",
    "app.about": "نبذة عني",
    "app.cv": "السيرة الذاتية",
    "app.contact": "تواصل",
    "app.placeholder": "المحتوى قريبًا.",
    "window.projects": "المشاريع",
    "finder.categories": "الفئات",
    "finder.cat.all": "الكل",
    "finder.cat.games": "ألعاب",
    "finder.cat.bots": "بوتات",
    "finder.cat.web": "ويب",
    "finder.cat.ext": "إضافات",
    "finder.launch": "تشغيل",
    "finder.viewCode": "عرض الكود",
    "smallScreen.title": "adib.os يُفتح على الحاسوب",
    "smallScreen.body":
      "هذه المحفظة عبارة عن نظام تشغيل صغير مُصمَّم للشاشات الكبيرة. عُد من حاسوب لاستكشافه.",
  },
  ja: {
    "menu.go": "移動",
    "menu.help": "ヘルプ",
    "lang.title": "言語",
    "app.finder": "Finder",
    "app.terminal": "ターミナル",
    "app.about": "プロフィール",
    "app.cv": "履歴書",
    "app.contact": "連絡先",
    "app.placeholder": "コンテンツは近日公開。",
    "window.projects": "プロジェクト",
    "finder.categories": "カテゴリ",
    "finder.cat.all": "すべて",
    "finder.cat.games": "ゲーム",
    "finder.cat.bots": "ボット",
    "finder.cat.web": "ウェブ",
    "finder.cat.ext": "拡張機能",
    "finder.launch": "起動",
    "finder.viewCode": "コードを見る",
    "smallScreen.title": "adib.os はパソコンで開きます",
    "smallScreen.body":
      "このポートフォリオは大きな画面のための小さな OS です。パソコンから戻って探索してください。",
  },
  ko: {
    "menu.go": "이동",
    "menu.help": "도움말",
    "lang.title": "언어",
    "app.finder": "Finder",
    "app.terminal": "터미널",
    "app.about": "소개",
    "app.cv": "이력서",
    "app.contact": "연락처",
    "app.placeholder": "콘텐츠 준비 중입니다.",
    "window.projects": "프로젝트",
    "finder.categories": "카테고리",
    "finder.cat.all": "전체",
    "finder.cat.games": "게임",
    "finder.cat.bots": "봇",
    "finder.cat.web": "웹",
    "finder.cat.ext": "확장 프로그램",
    "finder.launch": "실행",
    "finder.viewCode": "코드 보기",
    "smallScreen.title": "adib.os는 데스크톱에서 열립니다",
    "smallScreen.body":
      "이 포트폴리오는 큰 화면을 위한 작은 OS입니다. 컴퓨터에서 다시 방문해 둘러보세요.",
  },
} as const;

export type MessageKey = keyof (typeof dictionary)["fr"];

export const messages: Record<Locale, Record<MessageKey, string>> = dictionary;
