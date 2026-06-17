import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Masque le badge d'indicateur de dev Next.js (coin bas-gauche). Dev uniquement ;
  // les erreurs de compilation/runtime restent affichées.
  devIndicators: false,
  // Fixe la racine du workspace sur ce dossier. Sans ça, Next détecte un
  // package-lock.json parasite dans un dossier parent et infère une mauvaise racine.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
