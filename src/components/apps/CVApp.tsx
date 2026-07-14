"use client";

// Fenêtre CV : à gauche le récit + un bouton « télécharger » ; à droite un aperçu de la page
// rasterisée (WebP dans public/, générée hors ligne depuis le PDF — même parti-pris que les
// captures projet). L'aperçu vit dans un conteneur DOM qu'on maîtrise → scrollbar dans le thème
// (`themed-scroll`), contrairement au viewer PDF natif d'un <iframe> dont la barre n'est pas
// stylable. Le bouton « télécharger » sert le vrai PDF (texte sélectionnable, à jour).
import Image from "next/image";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ProjectGlyph } from "@/components/desktop/ProjectGlyph";
import { findApp } from "@/lib/apps";
import { AppShell } from "./AppShell";

const CV_URL = "/CV_Adib_Amrani.pdf";
const CV_PREVIEW = "/CV_Adib_Amrani.webp";
// Dimensions natives du WebP → ratio conservé par next/image (h-auto w-full).
const CV_PREVIEW_W = 1655;
const CV_PREVIEW_H = 2341;

function CVPreview() {
  const { t } = useI18n();
  return (
    <div className="themed-scroll h-full w-full overflow-y-auto rounded-[12px] border border-white/[0.08] bg-[#0d0f15] p-[14px]">
      <Image
        src={CV_PREVIEW}
        alt={t("app.cv")}
        width={CV_PREVIEW_W}
        height={CV_PREVIEW_H}
        // WebP déjà finalisée → servie telle quelle, sans la recompression Next (qualité 75).
        unoptimized
        className="h-auto w-full rounded-[8px] shadow-[0_20px_50px_-20px_rgba(0,0,0,.8)]"
      />
    </div>
  );
}

export function CVApp() {
  const { t } = useI18n();
  const app = findApp("cv");
  if (!app?.icon || !app.color) {
    throw new Error('CVApp : config d\'icône manquante pour "cv" dans apps.ts');
  }
  return (
    <AppShell
      icon={app.icon}
      color={app.color}
      name={t(app.labelKey)}
      fill
      descKey="cv.intro"
      preview={<CVPreview />}
      action={
        <a
          href={CV_URL}
          download
          className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-white/15 bg-white/[0.05] px-4 py-2 font-mono text-[12.5px] font-semibold text-[#d3d9e6] transition hover:bg-white/[0.1]"
        >
          <ProjectGlyph name="download" className="h-[16px] w-[16px]" />
          {t("cv.download")}
        </a>
      }
    />
  );
}
