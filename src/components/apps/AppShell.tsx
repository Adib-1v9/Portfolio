"use client";

// Coquille d'intérieur de fenêtre — layout « A · Split 42/58 » validé en maquette, partagé par
// TOUTES les fenêtres de contenu (projets + À propos / CV / Contact). À gauche (42%) : icône,
// nom, méta optionnelle, récit. À droite (58%) : surface d'aperçu — placeholder propre pour
// l'instant (les captures viendront plus tard). Le récit reste la chaîne i18n placeholder tant
// qu'Adib n'a pas écrit les textes à la main. Aucun bouton « Voir le code » : choix DA assumé.
import { useState, type ReactNode } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type { GlyphKey } from "@/lib/projectGlyphs";
import type { MessageKey } from "@/lib/i18n";
import { ProjectIcon } from "./ProjectIcon";
import { ProjectCarousel } from "./ProjectCarousel";

export function AppShell({
  icon,
  color,
  name,
  meta,
  metaColor,
  fill = false,
  descKey,
  techKey,
  tech = false,
  shots,
  reservePreview = false,
  preview,
}: {
  icon: GlyphKey;
  color: string;
  name: string;
  meta?: string; // ex. catégorie d'un projet ; absent pour les applis système
  metaColor?: string; // défaut : la couleur de l'icône (lie le titre à l'accent)
  fill?: boolean; // true = icône à fond plein coloré (apps système) ; false = graphite (projets)
  descKey?: MessageKey; // description traduite ; défaut = placeholder (apps système)
  techKey?: MessageKey; // texte « détails techniques » ; défaut = app.techSoon tant que vide
  tech?: boolean; // true (projets) = bouton qui bascule description ↔ détails techniques
  shots?: string[]; // captures du projet : carrousel si fournies, sinon surface placeholder
  reservePreview?: boolean; // true = garde le split + panneau placeholder même sans capture (CV)
  preview?: ReactNode; // contenu custom du panneau droit (ex. liens cliquables de Contact)
}) {
  const { t } = useI18n();
  // Bascule du TEXTE de gauche : description (défaut) ↔ détails techniques. La preview ne bouge pas.
  const [showTech, setShowTech] = useState(false);
  const hasShots = !!shots && shots.length > 0;
  // Rien à montrer à droite (projet sans capture : bots/mod ; ou app système À propos) → on centre
  // le récit plein cadre plutôt qu'un panneau vide. On garde le split si : captures (carrousel),
  // contenu custom (`preview`, ex. liens Contact), ou panneau réservé (CV).
  const centered = !hasShots && !reservePreview && !preview;

  const story = showTech ? t(techKey ?? "app.techSoon") : t(descKey ?? "app.placeholder");
  const techButton = tech && (
    <button
      type="button"
      onClick={() => setShowTech((v) => !v)}
      className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-white/15 bg-white/[0.05] px-4 py-2 font-mono text-[12.5px] font-semibold text-[#d3d9e6]"
    >
      {showTech ? t("app.description") : t("app.techDetails")}
    </button>
  );

  if (centered) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-[40px] text-center">
        <ProjectIcon
          icon={icon}
          color={color}
          fill={fill}
          box="h-[84px] w-[84px] rounded-[20px]"
          glyph="h-[44px] w-[44px]"
        />
        <h3 className="mb-[7px] mt-[20px] text-[27px] font-extrabold leading-tight tracking-[-0.02em] text-white">
          {name}
        </h3>
        {meta && (
          <div className="mb-4 font-mono text-[13px]" style={{ color: metaColor ?? color }}>
            {meta}
          </div>
        )}
        <p className="max-w-[56ch] text-[16.5px] leading-[1.7] text-[#aab2c3]">{story}</p>
        {techButton && <div className="mt-6">{techButton}</div>}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-[0_0_42%] flex-col border-r border-white/[0.06] p-[30px]">
        <ProjectIcon
          icon={icon}
          color={color}
          fill={fill}
          box="h-[72px] w-[72px] rounded-[18px]"
          glyph="h-[38px] w-[38px]"
        />
        <h3 className="mb-[7px] mt-[18px] text-[25px] font-extrabold leading-tight tracking-[-0.02em] text-white">
          {name}
        </h3>
        {meta && (
          <div
            className="mb-4 font-mono text-[13px]"
            style={{ color: metaColor ?? color }}
          >
            {meta}
          </div>
        )}
        <p className="max-w-[45ch] flex-1 text-[16px] leading-[1.65] text-[#aab2c3]">
          {story}
        </p>
        {techButton && <div className="mt-5">{techButton}</div>}
      </div>

      <div className="min-w-0 flex-1 p-[18px]">
        {hasShots ? (
          <ProjectCarousel shots={shots!} name={name} color={color} />
        ) : preview ? (
          preview
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-[12px] border border-white/[0.08] [background:radial-gradient(120%_120%_at_30%_10%,#1b2030,#0d0f15_70%)]">
            <span className="font-mono text-[12px] text-[#5d6680]">
              {t("app.placeholder")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
