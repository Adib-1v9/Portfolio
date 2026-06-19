import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Hanken_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { localeDir, LOCALE_COOKIE, resolveLocale } from "@/lib/i18n";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const cascadia = localFont({
  src: "../fonts/CascadiaCode.woff2",
  variable: "--font-cascadia",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "adib.os",
  description: "Le portfolio d'Adib, façon OS interactif.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Détection côté serveur (cookie prioritaire, sinon Accept-Language) → le HTML est rendu
  // d'emblée dans la bonne langue, sans flash ni mismatch d'hydratation.
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const locale = resolveLocale(
    cookieStore.get(LOCALE_COOKIE)?.value,
    requestHeaders.get("accept-language"),
  );

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      className={`${hanken.variable} ${cascadia.variable} h-full antialiased`}
    >
      {/* `cursor-pack-macos` = pack par défaut. Le système d'easter eggs (à venir) remplacera
          cette classe par celle d'un autre pack — cf. globals.css pour le pattern. */}
      <body className="h-full cursor-pack-macos">
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
