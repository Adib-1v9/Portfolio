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
    "contact.copy": "Cliquer pour copier",
    "contact.copied": "Copié !",
    "contact.soon": "Bientôt",
    "contact.intro": "Vous pouvez me joindre via l'un de ces canaux.",
    "apropos.intro":
      "Salut, moi c'est Adib, étudiant en informatique à Montpellier. La création m'a toujours animé, qu'il s'agisse d'apprendre ou de développer une appli dont j'ai eu l'idée. Vous trouverez ici la plupart de mes projets. N'hésitez pas à explorer le bureau, il s'y cache peut-être quelques surprises.",
    "cv.intro": "Mon parcours et mes expériences.",
    "cv.download": "Télécharger le CV",
    "window.projects": "Projets",
    "finder.categories": "Catégories",
    "finder.cat.all": "Tout",
    "finder.cat.games": "Jeux",
    "finder.cat.bots": "Bots",
    "finder.cat.web": "Web",
    "finder.cat.ext": "Extensions",
    "finder.more": "Voir plus",
    "finder.viewCode": "Voir le code",
    "app.techDetails": "Détails techniques",
    "app.description": "Description",
    "app.techSoon": "Fiche technique bientôt disponible.",
    "proj.gachanime.desc":
      "De loin mon projet le plus ambitieux à ce jour. Inspiré des mécaniques de gacha, c'est un jeu de cartes à collectionner où l'on échange avec ses amis et personnalise son profil. Notamment en mettant en avant ses cartes les plus rares.",
    "proj.starbucks-legacy.desc":
      "Mon tout premier projet. Un petit jeu où l'on dirige un personnage dans un monde en 2D et où l'on interagit avec les éléments de différents environnements.",
    "proj.notagain.desc":
      "Un mod pour Minecraft qui ajoute de nouveaux objets et des événements interactifs.",
    "proj.sagwa-bot.desc":
      "Un bot Discord polyvalent, capable d'exécuter toutes sortes de commandes sur un serveur.",
    "proj.ckd-bot.desc":
      "Un bot Discord à fonction unique : prévenir les gens à l'approche des dates d'examens.",
    "proj.spotify-stats.desc":
      "Une application web pour consulter ses statistiques d'écoute Spotify.",
    "proj.weather.desc": "Une application météo classique.",
    "proj.bombparty.desc":
      "Une application de bureau pour \"tricher\" à BombParty, le jeu où il faut trouver des mots contenant une syllabe imposée.",
    "proj.gachanime.tech":
      "Une application web en TypeScript avec React et Vite. L'interface s'appuie sur Tailwind CSS et les composants shadcn/ui, et Supabase gère la base de données : collections de cartes, échanges et profils des joueurs.",
    "proj.starbucks-legacy.tech":
      "Écrit en Python avec la bibliothèque Pygame, qui gère l'affichage en 2D, les animations et les interactions au clavier.",
    "proj.notagain.tech":
      "Un mod écrit en Java avec Fabric, le chargeur de mods de Minecraft (version 1.21.5), et compilé avec Gradle.",
    "proj.sagwa-bot.tech":
      "Développé en JavaScript avec Node.js et la bibliothèque discord.js. Le code est découpé en commandes et en gestionnaires pour rester modulaire.",
    "proj.ckd-bot.tech":
      "Développé en JavaScript avec Node.js et discord.js, sur la même base que sagwa-bot mais réduit à sa seule fonction de rappel.",
    "proj.spotify-stats.tech":
      "Pour l'instant une application de bureau en Electron, dont l'interface dialogue avec un serveur Python en Flask : j'interroge l'API de Spotify avec spotipy et je stocke les statistiques dans une base Supabase. Je compte la faire évoluer vers une véritable application web.",
    "proj.weather.tech":
      "Un projet full stack entièrement en TypeScript : une interface React montée avec Vite, qui consomme une API maison construite avec NestJS.",
    "proj.bombparty.tech":
      "Une application de bureau en Electron qui s'affiche en surimpression par dessus le jeu. Elle capture l'écran et lit la syllabe imposée par reconnaissance de caractères avec tesseract.js, puis cherche les mots correspondants dans un dictionnaire.",
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
    "contact.copy": "Click to copy",
    "contact.copied": "Copied!",
    "contact.soon": "Coming soon",
    "contact.intro": "You can reach me through any of these channels.",
    "apropos.intro":
      "Hi, I'm Adib, a computer science student in Montpellier. Making things has always driven me, whether that means learning something new or building an app I had in mind. You'll find most of my projects here. Feel free to explore the desktop, a few surprises may be hiding around.",
    "cv.intro": "My background and experience.",
    "cv.download": "Download CV",
    "window.projects": "Projects",
    "finder.categories": "Categories",
    "finder.cat.all": "All",
    "finder.cat.games": "Games",
    "finder.cat.bots": "Bots",
    "finder.cat.web": "Web",
    "finder.cat.ext": "Extensions",
    "finder.more": "See more",
    "finder.viewCode": "View code",
    "app.techDetails": "Technical details",
    "app.description": "Description",
    "app.techSoon": "Technical breakdown coming soon.",
    "proj.gachanime.desc":
      "By far my most ambitious project to date. Inspired by gacha mechanics, it's a collectible card game where you trade with friends and customize your profile, showing off your rarest cards.",
    "proj.starbucks-legacy.desc":
      "My very first project. A small game where you guide a character through a 2D world and interact with the elements of different environments.",
    "proj.notagain.desc":
      "A Minecraft mod that adds new items and interactive events.",
    "proj.sagwa-bot.desc":
      "A versatile Discord bot that can run all sorts of commands on a server.",
    "proj.ckd-bot.desc":
      "A single purpose Discord bot: reminding people as exam dates draw near.",
    "proj.spotify-stats.desc":
      "A web app to check your Spotify listening stats.",
    "proj.weather.desc": "A classic weather app.",
    "proj.bombparty.desc":
      "A desktop app to \"cheat\" at BombParty, the game where you have to find words containing a given syllable.",
    "proj.gachanime.tech":
      "A web app built in TypeScript with React and Vite. The interface relies on Tailwind CSS and shadcn/ui components, while Supabase handles the database: card collections, trades and player profiles.",
    "proj.starbucks-legacy.tech":
      "Written in Python with the Pygame library, which handles the 2D rendering, the animations and the keyboard input.",
    "proj.notagain.tech":
      "A mod written in Java with Fabric, the Minecraft mod loader (version 1.21.5), and built with Gradle.",
    "proj.sagwa-bot.tech":
      "Built in JavaScript with Node.js and the discord.js library. The code is split into commands and handlers to stay modular.",
    "proj.ckd-bot.tech":
      "Built in JavaScript with Node.js and discord.js, on the same base as sagwa-bot but trimmed down to its single reminder function.",
    "proj.spotify-stats.tech":
      "For now a desktop app built with Electron, whose interface talks to a Python server running Flask: I query the Spotify API with spotipy and store the stats in a Supabase database. I plan to turn it into a proper web app.",
    "proj.weather.tech":
      "A full stack project written entirely in TypeScript: a React interface built with Vite that consumes a homemade API built with NestJS.",
    "proj.bombparty.tech":
      "A desktop app built with Electron that overlays on top of the game. It captures the screen and reads the required syllable through character recognition with tesseract.js, then looks for matching words in a dictionary.",
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
    "contact.copy": "Clic para copiar",
    "contact.copied": "¡Copiado!",
    "contact.soon": "Próximamente",
    "contact.intro": "Puedes contactarme por cualquiera de estos canales.",
    "apropos.intro":
      "Hola, soy Adib, estudiante de informática en Montpellier. Crear siempre me ha movido, ya sea aprender algo nuevo o desarrollar una app que tenía en mente. Aquí encontrarás la mayoría de mis proyectos. No dudes en explorar el escritorio, puede que se escondan algunas sorpresas.",
    "cv.intro": "Mi trayectoria y mi experiencia.",
    "cv.download": "Descargar CV",
    "window.projects": "Proyectos",
    "finder.categories": "Categorías",
    "finder.cat.all": "Todo",
    "finder.cat.games": "Juegos",
    "finder.cat.bots": "Bots",
    "finder.cat.web": "Web",
    "finder.cat.ext": "Extensiones",
    "finder.more": "Ver más",
    "finder.viewCode": "Ver código",
    "app.techDetails": "Detalles técnicos",
    "app.description": "Descripción",
    "app.techSoon": "Ficha técnica próximamente.",
    "proj.gachanime.desc":
      "De lejos, mi proyecto más ambicioso hasta la fecha. Inspirado en las mecánicas de gacha, es un juego de cartas coleccionables en el que intercambias con tus amigos y personalizas tu perfil, destacando tus cartas más raras.",
    "proj.starbucks-legacy.desc":
      "Mi primer proyecto. Un pequeño juego en el que diriges a un personaje por un mundo en 2D e interactúas con los elementos de distintos entornos.",
    "proj.notagain.desc":
      "Un mod para Minecraft que añade nuevos objetos y eventos interactivos.",
    "proj.sagwa-bot.desc":
      "Un bot de Discord versátil, capaz de ejecutar todo tipo de comandos en un servidor.",
    "proj.ckd-bot.desc":
      "Un bot de Discord con una sola función: avisar a la gente cuando se acercan las fechas de los exámenes.",
    "proj.spotify-stats.desc":
      "Una aplicación web para consultar tus estadísticas de escucha de Spotify.",
    "proj.weather.desc": "Una aplicación del tiempo clásica.",
    "proj.bombparty.desc":
      "Una aplicación de escritorio para \"hacer trampa\" en BombParty, el juego en el que hay que encontrar palabras que contengan una sílaba dada.",
    "proj.gachanime.tech":
      "Una aplicación web hecha en TypeScript con React y Vite. La interfaz se apoya en Tailwind CSS y los componentes de shadcn/ui, mientras que Supabase gestiona la base de datos: colecciones de cartas, intercambios y perfiles de los jugadores.",
    "proj.starbucks-legacy.tech":
      "Escrito en Python con la biblioteca Pygame, que se encarga del renderizado en 2D, las animaciones y las interacciones con el teclado.",
    "proj.notagain.tech":
      "Un mod escrito en Java con Fabric, el cargador de mods de Minecraft (versión 1.21.5), y compilado con Gradle.",
    "proj.sagwa-bot.tech":
      "Desarrollado en JavaScript con Node.js y la biblioteca discord.js. El código está dividido en comandos y manejadores para mantenerse modular.",
    "proj.ckd-bot.tech":
      "Desarrollado en JavaScript con Node.js y discord.js, sobre la misma base que sagwa-bot pero reducido a su única función de recordatorio.",
    "proj.spotify-stats.tech":
      "Por ahora una aplicación de escritorio en Electron, cuya interfaz se comunica con un servidor Python en Flask: consulto la API de Spotify con spotipy y guardo las estadísticas en una base de datos Supabase. Tengo previsto convertirla en una verdadera aplicación web.",
    "proj.weather.tech":
      "Un proyecto full stack escrito enteramente en TypeScript: una interfaz React montada con Vite que consume una API propia construida con NestJS.",
    "proj.bombparty.tech":
      "Una aplicación de escritorio en Electron que se superpone sobre el juego. Captura la pantalla y lee la sílaba impuesta mediante reconocimiento de caracteres con tesseract.js, y luego busca las palabras correspondientes en un diccionario.",
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
    "contact.copy": "Zum Kopieren klicken",
    "contact.copied": "Kopiert!",
    "contact.soon": "Demnächst",
    "contact.intro": "Sie können mich über einen dieser Kanäle erreichen.",
    "apropos.intro":
      "Hallo, ich bin Adib, Informatikstudent in Montpellier. Etwas zu erschaffen hat mich schon immer angetrieben, sei es Neues zu lernen oder eine App umzusetzen, die mir im Kopf herumging. Hier finden Sie die meisten meiner Projekte. Erkunden Sie ruhig den Desktop, vielleicht verstecken sich ein paar Überraschungen.",
    "cv.intro": "Mein Werdegang und meine Erfahrung.",
    "cv.download": "Lebenslauf herunterladen",
    "window.projects": "Projekte",
    "finder.categories": "Kategorien",
    "finder.cat.all": "Alle",
    "finder.cat.games": "Spiele",
    "finder.cat.bots": "Bots",
    "finder.cat.web": "Web",
    "finder.cat.ext": "Erweiterungen",
    "finder.more": "Mehr ansehen",
    "finder.viewCode": "Code ansehen",
    "app.techDetails": "Technische Details",
    "app.description": "Beschreibung",
    "app.techSoon": "Technische Details folgen in Kürze.",
    "proj.gachanime.desc":
      "Mit Abstand mein bisher ehrgeizigstes Projekt. Inspiriert von Gacha Mechaniken, ist es ein Sammelkartenspiel, in dem man mit Freunden tauscht und sein Profil gestaltet, indem man vor allem seine seltensten Karten in Szene setzt.",
    "proj.starbucks-legacy.desc":
      "Mein allererstes Projekt. Ein kleines Spiel, in dem man eine Figur durch eine 2D Welt steuert und mit den Elementen verschiedener Umgebungen interagiert.",
    "proj.notagain.desc":
      "Eine Minecraft Mod, die neue Gegenstände und interaktive Ereignisse hinzufügt.",
    "proj.sagwa-bot.desc":
      "Ein vielseitiger Discord Bot, der alle möglichen Befehle auf einem Server ausführen kann.",
    "proj.ckd-bot.desc":
      "Ein Discord Bot mit nur einer Aufgabe: die Leute zu erinnern, wenn Prüfungstermine näher rücken.",
    "proj.spotify-stats.desc":
      "Eine Web App, um deine Spotify Hörstatistiken einzusehen.",
    "proj.weather.desc": "Eine klassische Wetter App.",
    "proj.bombparty.desc":
      "Eine Desktop App, um bei BombParty zu \"schummeln\", dem Spiel, in dem man Wörter mit einer vorgegebenen Silbe finden muss.",
    "proj.gachanime.tech":
      "Eine Web App in TypeScript mit React und Vite. Die Oberfläche basiert auf Tailwind CSS und den shadcn/ui Komponenten, während Supabase die Datenbank verwaltet: Kartensammlungen, Tauschgeschäfte und Spielerprofile.",
    "proj.starbucks-legacy.tech":
      "In Python mit der Pygame Bibliothek geschrieben, die die 2D Darstellung, die Animationen und die Tastatureingaben übernimmt.",
    "proj.notagain.tech":
      "Ein Mod, geschrieben in Java mit Fabric, dem Mod Loader von Minecraft (Version 1.21.5), und mit Gradle gebaut.",
    "proj.sagwa-bot.tech":
      "Entwickelt in JavaScript mit Node.js und der Bibliothek discord.js. Der Code ist in Befehle und Handler aufgeteilt, um modular zu bleiben.",
    "proj.ckd-bot.tech":
      "Entwickelt in JavaScript mit Node.js und discord.js, auf derselben Basis wie sagwa-bot, aber auf seine einzige Erinnerungsfunktion reduziert.",
    "proj.spotify-stats.tech":
      "Vorerst eine Desktop App mit Electron, deren Oberfläche mit einem Python Server unter Flask kommuniziert: Ich frage die Spotify API mit spotipy ab und speichere die Statistiken in einer Supabase Datenbank. Ich habe vor, sie zu einer echten Web App weiterzuentwickeln.",
    "proj.weather.tech":
      "Ein Full Stack Projekt, komplett in TypeScript geschrieben: eine React Oberfläche mit Vite, die eine selbst gebaute API auf Basis von NestJS nutzt.",
    "proj.bombparty.tech":
      "Eine Desktop App mit Electron, die sich über das Spiel legt. Sie erfasst den Bildschirm und liest die vorgegebene Silbe per Zeichenerkennung mit tesseract.js, und sucht dann passende Wörter in einem Wörterbuch.",
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
    "contact.copy": "انقر للنسخ",
    "contact.copied": "تم النسخ!",
    "contact.soon": "قريبًا",
    "contact.intro": "يمكنك التواصل معي عبر أي من هذه القنوات.",
    "apropos.intro":
      "مرحبًا، أنا أديب، طالب علوم حاسوب في مونبلييه. الإبداع كان دائمًا ما يحركني، سواء لتعلّم شيء جديد أو لتطوير تطبيق راود ذهني. تجدون هنا معظم مشاريعي. لا تترددوا في استكشاف سطح المكتب، فقد تختبئ فيه بعض المفاجآت.",
    "cv.intro": "مساري وخبراتي.",
    "cv.download": "تنزيل السيرة الذاتية",
    "window.projects": "المشاريع",
    "finder.categories": "الفئات",
    "finder.cat.all": "الكل",
    "finder.cat.games": "ألعاب",
    "finder.cat.bots": "بوتات",
    "finder.cat.web": "ويب",
    "finder.cat.ext": "إضافات",
    "finder.more": "عرض المزيد",
    "finder.viewCode": "عرض الكود",
    "app.techDetails": "التفاصيل التقنية",
    "app.description": "الوصف",
    "app.techSoon": "التفاصيل التقنية قريبًا.",
    "proj.gachanime.desc":
      "أكثر مشاريعي طموحًا حتى الآن بفارق كبير. مستوحى من آليات الغاتشا، وهو لعبة بطاقات قابلة للجمع تتيح لك التبادل مع أصدقائك وتخصيص ملفك الشخصي، لا سيما بإبراز أندر بطاقاتك.",
    "proj.starbucks-legacy.desc":
      "أول مشروع لي على الإطلاق. لعبة صغيرة توجّه فيها شخصية عبر عالم ثنائي الأبعاد وتتفاعل مع عناصر بيئات مختلفة.",
    "proj.notagain.desc":
      "تعديل للعبة ماين كرافت يضيف أغراضًا جديدة وأحداثًا تفاعلية.",
    "proj.sagwa-bot.desc":
      "بوت ديسكورد متعدد الاستخدامات، قادر على تنفيذ مختلف أنواع الأوامر داخل الخادم.",
    "proj.ckd-bot.desc":
      "بوت ديسكورد بوظيفة واحدة: تذكير الناس عند اقتراب مواعيد الامتحانات.",
    "proj.spotify-stats.desc":
      "تطبيق ويب لعرض إحصائيات استماعك على سبوتيفاي.",
    "proj.weather.desc": "تطبيق طقس كلاسيكي.",
    "proj.bombparty.desc":
      "تطبيق سطح مكتب \"للغش\" في لعبة BombParty، اللعبة التي عليك فيها إيجاد كلمات تحتوي على مقطع صوتي محدّد.",
    "proj.gachanime.tech":
      "تطبيق ويب مكتوب بلغة TypeScript باستخدام React وVite. تعتمد الواجهة على Tailwind CSS ومكوّنات shadcn/ui، بينما تتولّى Supabase إدارة قاعدة البيانات: مجموعات البطاقات والتبادلات وملفات اللاعبين.",
    "proj.starbucks-legacy.tech":
      "مكتوب بلغة Python باستخدام مكتبة Pygame التي تتولّى العرض ثنائي الأبعاد والرسوم المتحركة والتفاعل عبر لوحة المفاتيح.",
    "proj.notagain.tech":
      "تعديل مكتوب بلغة Java باستخدام Fabric، مُحمّل تعديلات ماين كرافت (الإصدار 1.21.5)، ومبني باستخدام Gradle.",
    "proj.sagwa-bot.tech":
      "مطوّر بلغة JavaScript باستخدام Node.js ومكتبة discord.js. الكود مقسّم إلى أوامر ومعالجات ليبقى مرنًا.",
    "proj.ckd-bot.tech":
      "مطوّر بلغة JavaScript باستخدام Node.js وdiscord.js، على نفس أساس sagwa-bot لكن مختصرًا على وظيفة التذكير الوحيدة.",
    "proj.spotify-stats.tech":
      "في الوقت الحالي تطبيق سطح مكتب بـ Electron، تتواصل واجهته مع خادم Python يعمل بـ Flask: أستعلم عن واجهة Spotify باستخدام spotipy وأخزّن الإحصائيات في قاعدة بيانات Supabase. أنوي تطويره ليصبح تطبيق ويب حقيقيًا.",
    "proj.weather.tech":
      "مشروع متكامل (full stack) مكتوب بالكامل بلغة TypeScript: واجهة React مبنية بـ Vite تستهلك واجهة برمجية خاصة بُنيت بـ NestJS.",
    "proj.bombparty.tech":
      "تطبيق سطح مكتب بـ Electron يظهر فوق اللعبة. يلتقط الشاشة ويقرأ المقطع الصوتي المطلوب عبر التعرّف الضوئي على الحروف باستخدام tesseract.js، ثم يبحث عن الكلمات المطابقة في قاموس.",
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
    "contact.copy": "クリックでコピー",
    "contact.copied": "コピーしました！",
    "contact.soon": "近日公開",
    "contact.intro": "以下のいずれかの方法でご連絡いただけます。",
    "apropos.intro":
      "こんにちは、Adibと申します。モンペリエで情報学を学んでいる学生です。何かを作ることに常に心を動かされてきました。新しいことを学ぶためでも、頭の中にあったアプリを形にするためでも。ここでは私のプロジェクトのほとんどをご覧いただけます。デスクトップもぜひ探索してみてください。ちょっとした驚きが隠れているかもしれません。",
    "cv.intro": "これまでの経歴と経験。",
    "cv.download": "履歴書をダウンロード",
    "window.projects": "プロジェクト",
    "finder.categories": "カテゴリ",
    "finder.cat.all": "すべて",
    "finder.cat.games": "ゲーム",
    "finder.cat.bots": "ボット",
    "finder.cat.web": "ウェブ",
    "finder.cat.ext": "拡張機能",
    "finder.more": "詳細を見る",
    "finder.viewCode": "コードを見る",
    "app.techDetails": "技術詳細",
    "app.description": "説明",
    "app.techSoon": "技術詳細は近日公開。",
    "proj.gachanime.desc":
      "現時点で最も野心的なプロジェクト。ガチャの仕組みから着想を得た収集型カードゲームで、友達とトレードしたり、特に一番レアなカードを際立たせてプロフィールをカスタマイズできます。",
    "proj.starbucks-legacy.desc":
      "初めて作ったプロジェクト。2Dの世界でキャラクターを操作し、さまざまな環境の要素と関わる小さなゲームです。",
    "proj.notagain.desc":
      "新しいアイテムやインタラクティブなイベントを追加するMinecraftのMODです。",
    "proj.sagwa-bot.desc":
      "サーバー上であらゆる種類のコマンドを実行できる、多機能なDiscordボットです。",
    "proj.ckd-bot.desc":
      "試験日が近づくとメンバーに知らせる、単機能のDiscordボットです。",
    "proj.spotify-stats.desc":
      "Spotifyのリスニング統計を確認できるウェブアプリです。",
    "proj.weather.desc": "オーソドックスな天気アプリ。",
    "proj.bombparty.desc":
      "指定された音節を含む単語を見つけるゲーム、BombPartyで\"チート\"するためのデスクトップアプリです。",
    "proj.gachanime.tech":
      "TypeScriptでReactとViteを使って作ったウェブアプリです。インターフェースはTailwind CSSとshadcn/uiのコンポーネントで構築し、Supabaseがデータベース（カードコレクション、トレード、プレイヤープロフィール）を管理します。",
    "proj.starbucks-legacy.tech":
      "PythonとPygameライブラリで書いており、2D描画、アニメーション、キーボード操作を扱っています。",
    "proj.notagain.tech":
      "MinecraftのmodローダーFabric（バージョン1.21.5）を使い、Javaで書いてGradleでビルドしたmodです。",
    "proj.sagwa-bot.tech":
      "Node.jsとdiscord.jsライブラリを使ってJavaScriptで開発しました。コードはコマンドとハンドラーに分割し、モジュール性を保っています。",
    "proj.ckd-bot.tech":
      "Node.jsとdiscord.jsを使ってJavaScriptで開発しました。sagwa-botと同じ土台ですが、唯一のリマインダー機能だけに絞っています。",
    "proj.spotify-stats.tech":
      "今のところElectronのデスクトップアプリで、インターフェースはFlaskで動くPythonサーバーとやり取りします。spotipyでSpotify APIを呼び出し、統計をSupabaseのデータベースに保存しています。今後は本格的なウェブアプリへ進化させる予定です。",
    "proj.weather.tech":
      "すべてTypeScriptで書いたフルスタックのプロジェクトです。Viteで構築したReactのインターフェースが、NestJSで作った自作APIを利用します。",
    "proj.bombparty.tech":
      "ゲームの上に重ねて表示するElectronのデスクトップアプリです。画面をキャプチャし、tesseract.jsの文字認識で指定された音節を読み取り、辞書から該当する単語を探します。",
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
    "contact.copy": "클릭하여 복사",
    "contact.copied": "복사됨!",
    "contact.soon": "곧 공개",
    "contact.intro": "다음 채널 중 하나로 연락하실 수 있습니다.",
    "apropos.intro":
      "안녕하세요, Adib입니다. 몽펠리에에서 컴퓨터공학을 공부하고 있는 학생입니다. 무언가를 만드는 일이 늘 저를 움직여 왔습니다. 새로운 것을 배우기 위해서든, 머릿속에 있던 앱을 직접 만들어 보기 위해서든요. 여기에서 제 프로젝트 대부분을 보실 수 있습니다. 데스크톱도 한번 둘러보세요. 작은 깜짝 요소들이 숨어 있을지도 모릅니다.",
    "cv.intro": "저의 이력과 경험.",
    "cv.download": "이력서 다운로드",
    "window.projects": "프로젝트",
    "finder.categories": "카테고리",
    "finder.cat.all": "전체",
    "finder.cat.games": "게임",
    "finder.cat.bots": "봇",
    "finder.cat.web": "웹",
    "finder.cat.ext": "확장 프로그램",
    "finder.more": "더 보기",
    "finder.viewCode": "코드 보기",
    "app.techDetails": "기술 상세",
    "app.description": "설명",
    "app.techSoon": "기술 상세는 곧 공개됩니다.",
    "proj.gachanime.desc":
      "현재까지 가장 야심 찬 프로젝트입니다. 가챠 메커니즘에서 영감을 받은 수집형 카드 게임으로, 친구와 카드를 교환하고 특히 가장 희귀한 카드를 앞세워 프로필을 꾸밀 수 있습니다.",
    "proj.starbucks-legacy.desc":
      "제가 만든 첫 프로젝트입니다. 2D 세계에서 캐릭터를 조종하고 다양한 환경의 요소와 상호작용하는 작은 게임입니다.",
    "proj.notagain.desc":
      "새로운 아이템과 인터랙티브한 이벤트를 추가하는 마인크래프트 모드입니다.",
    "proj.sagwa-bot.desc":
      "서버에서 온갖 종류의 명령을 실행할 수 있는 다재다능한 디스코드 봇입니다.",
    "proj.ckd-bot.desc":
      "시험 날짜가 다가오면 사람들에게 알려 주는 단일 기능 디스코드 봇입니다.",
    "proj.spotify-stats.desc":
      "자신의 Spotify 청취 통계를 확인할 수 있는 웹 앱입니다.",
    "proj.weather.desc": "클래식한 날씨 앱입니다.",
    "proj.bombparty.desc":
      "주어진 음절이 들어간 단어를 찾아야 하는 게임 BombParty에서 \"치트\"할 수 있는 데스크톱 앱입니다.",
    "proj.gachanime.tech":
      "TypeScript로 React와 Vite를 사용해 만든 웹 앱입니다. 인터페이스는 Tailwind CSS와 shadcn/ui 컴포넌트로 구성했고, Supabase가 데이터베이스(카드 컬렉션, 교환, 플레이어 프로필)를 관리합니다.",
    "proj.starbucks-legacy.tech":
      "Python과 Pygame 라이브러리로 작성했으며, 2D 렌더링과 애니메이션, 키보드 입력을 처리합니다.",
    "proj.notagain.tech":
      "Minecraft 모드 로더인 Fabric(버전 1.21.5)을 사용해 Java로 작성하고 Gradle로 빌드한 모드입니다.",
    "proj.sagwa-bot.tech":
      "Node.js와 discord.js 라이브러리를 사용해 JavaScript로 개발했습니다. 코드는 명령과 핸들러로 나누어 모듈성을 유지합니다.",
    "proj.ckd-bot.tech":
      "Node.js와 discord.js를 사용해 JavaScript로 개발했습니다. sagwa-bot과 같은 토대지만 알림이라는 단일 기능만 남겼습니다.",
    "proj.spotify-stats.tech":
      "현재는 Electron 데스크톱 앱으로, 인터페이스가 Flask로 동작하는 Python 서버와 통신합니다. spotipy로 Spotify API를 호출하고 통계를 Supabase 데이터베이스에 저장합니다. 앞으로는 진정한 웹 앱으로 발전시킬 계획입니다.",
    "proj.weather.tech":
      "전부 TypeScript로 작성한 풀스택 프로젝트입니다. Vite로 만든 React 인터페이스가 NestJS로 구축한 자체 API를 사용합니다.",
    "proj.bombparty.tech":
      "게임 위에 겹쳐 표시되는 Electron 데스크톱 앱입니다. 화면을 캡처하고 tesseract.js의 문자 인식으로 주어진 음절을 읽어 사전에서 해당하는 단어를 찾습니다.",
    "smallScreen.title": "adib.os는 데스크톱에서 열립니다",
    "smallScreen.body":
      "이 포트폴리오는 큰 화면을 위한 작은 OS입니다. 컴퓨터에서 다시 방문해 둘러보세요.",
  },
} as const;

export type MessageKey = keyof (typeof dictionary)["fr"];

export const messages: Record<Locale, Record<MessageKey, string>> = dictionary;
