"use client";

// Intérieur générique des fenêtres pas encore remplies (À propos / CV / Contact). Le contenu
// réel viendra plus tard ; ici on affiche juste la chaîne i18n « bientôt disponible ».
import { useI18n } from "@/components/i18n/LanguageProvider";

export function PlaceholderApp() {
  const { t } = useI18n();
  return (
    <div className="flex h-full items-center justify-center p-10 text-center font-mono text-[13px] text-[#8d96a9]">
      {t("app.placeholder")}
    </div>
  );
}
