"use client";

// Intérieur du Finder : catalogue 3 colonnes (catégories | liste | aperçu), repris de la
// maquette validée. Filtrage par catégorie + sélection pour l'aperçu. « Lancer » est inerte
// tant qu'aucune app n'est jouable dans l'OS ; « Voir le code » ouvre le repo public.
import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import {
  CATEGORY_LABEL,
  PROJECTS,
  type ProjectCategory,
} from "@/lib/projects";
import { COLORS } from "@/lib/theme";

type Filter = "all" | ProjectCategory;

const CATEGORIES: { id: Filter; dot: string }[] = [
  { id: "all", dot: COLORS.accentBlue },
  { id: "games", dot: COLORS.accentGreen },
  { id: "bots", dot: COLORS.accentOrange },
  { id: "web", dot: "#1DB954" },
  { id: "ext", dot: COLORS.accentRed },
];

export function FinderApp() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string>(PROJECTS[0].id);

  const visible =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const selected = PROJECTS.find((p) => p.id === selectedId) ?? PROJECTS[0];

  const label = (id: Filter) =>
    id === "all" ? t("finder.cat.all") : t(CATEGORY_LABEL[id]);

  return (
    <div className="flex h-full">
      <aside className="w-[188px] flex-none border-r border-white/[0.07] bg-[#12141A]/70 p-2.5">
        <div className="px-2.5 pb-1.5 pt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#6f788d]">
          {t("finder.categories")}
        </div>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`flex w-full items-center gap-2.5 rounded-[7px] px-2.5 py-[7px] text-left text-[13px] ${
              filter === c.id ? "bg-[#2E8BFF]/[0.16] text-white" : "text-[#c3cad9]"
            }`}
          >
            <span
              className="h-[9px] w-[9px] flex-none rounded-[3px]"
              style={{ background: c.dot }}
            />
            {label(c.id)}
          </button>
        ))}
      </aside>

      <div className="w-[248px] flex-none overflow-auto border-r border-white/[0.07]">
        {visible.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedId(p.id)}
            className={`flex w-full items-center gap-[11px] border-b border-white/[0.04] px-3.5 py-[11px] text-left ${
              p.id === selected.id ? "bg-[#2E8BFF]/[0.13]" : ""
            }`}
          >
            <span
              className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] font-mono text-[14px] font-bold text-white"
              style={{ background: p.color }}
            >
              {p.glyph}
            </span>
            <span className="min-w-0">
              <b className="block truncate text-[13.5px] font-semibold text-[#eef1f7]">
                {p.name}
              </b>
              <span className="block font-mono text-[10.5px] text-[#8d96a9]">
                {label(p.category)}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-[22px]">
        <span
          className="mb-3.5 flex h-[74px] w-[74px] items-center justify-center rounded-[18px] font-mono text-[30px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.28)]"
          style={{ background: selected.color }}
        >
          {selected.glyph}
        </span>
        <h3 className="mb-1.5 text-[22px] font-extrabold text-white">
          {selected.name}
        </h3>
        <div className="mb-3 font-mono text-[11px] text-[#30D158]">
          {label(selected.category)}
        </div>
        <p className="mb-4 text-[13px] leading-[1.6] text-[#aab2c3]">
          {t("app.placeholder")}
        </p>
        <div className="mt-auto flex gap-2.5">
          <button
            type="button"
            disabled={!selected.launchable}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#30D158] px-4 py-2.5 font-mono text-[13px] font-bold text-[#06210f] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ▶ {t("finder.launch")}
          </button>
          {selected.repoUrl && (
            <a
              href={selected.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[10px] border border-white/15 px-4 py-2.5 font-mono text-[13px] font-semibold text-[#cdd2dd]"
            >
              {t("finder.viewCode")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
