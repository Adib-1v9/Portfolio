"use client";

// Fenêtre CV : à gauche le récit + un bouton « télécharger » ; à droite un aperçu du PDF rendu
// par le viewer natif du navigateur (iframe). Le PDF vit dans public/ → servi tel quel, sans
// dépendance de rendu. `#toolbar=0` masque la barre d'outils du viewer pour un rendu intégré
// (paramètre du plugin PDF, ignoré silencieusement s'il n'est pas supporté).
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ProjectGlyph } from "@/components/desktop/ProjectGlyph";
import { findApp } from "@/lib/apps";
import { AppShell } from "./AppShell";

const CV_URL = "/CV_Adib_Amrani.pdf";

function CVPreview() {
  const { t } = useI18n();
  return (
    <div className="h-full w-full overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#0d0f15]">
      <iframe
        src={`${CV_URL}#toolbar=0&view=FitH`}
        title={t("app.cv")}
        className="h-full w-full border-0"
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
