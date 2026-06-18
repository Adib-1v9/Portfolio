"use client";

// Intérieur du Finder : catalogue 3 colonnes (catégories | liste | aperçu), repris de la
// maquette validée. Filtrage par catégorie + sélection pour l'aperçu. Le bouton « Voir plus »
// ouvre la fenêtre du projet (la même qu'au double-clic de son icône sur le bureau).
import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useWindows } from "@/components/windows/WindowProvider";
import {
  CATEGORY_LABEL,
  PROJECTS,
  projectWindowId,
  type ProjectCategory,
} from "@/lib/projects";
import { COLORS } from "@/lib/theme";
import { ProjectIcon } from "./ProjectIcon";

type Filter = "all" | ProjectCategory;

const CATEGORIES: { id: Filter; dot: string }[] = [
  { id: "all", dot: "#FFFFFF" }, // blanc : neutre, libère le bleu pour les Jeux
  { id: "games", dot: COLORS.accentBlue }, // bleu (ex-couleur de « Tout »), distinct du Web (vert)
  { id: "bots", dot: COLORS.accentOrange },
  { id: "web", dot: "#1DB954" },
  { id: "ext", dot: COLORS.accentRed },
];

export function FinderApp() {
  const { t } = useI18n();
  const { open } = useWindows();
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
            <ProjectIcon
              icon={p.icon}
              color={p.color}
              box="h-[34px] w-[34px] rounded-[10px]"
              glyph="h-[18px] w-[18px]"
            />
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
        <ProjectIcon
          icon={selected.icon}
          color={selected.color}
          box="mb-3.5 h-[74px] w-[74px] rounded-[18px]"
          glyph="h-[36px] w-[36px]"
        />
        <h3 className="mb-1.5 text-[22px] font-extrabold text-white">
          {selected.name}
        </h3>
        <div className="mb-3 font-mono text-[11px] text-[#30D158]">
          {label(selected.category)}
        </div>
        <p className="mb-4 text-[13px] leading-[1.6] text-[#aab2c3]">
          {t(selected.descKey)}
        </p>
        <div className="mt-auto">
          <button
            type="button"
            onClick={() => open(projectWindowId(selected.id))}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#2E8BFF] px-5 py-2.5 font-mono text-[13px] font-bold text-white"
          >
            {t("finder.more")}
          </button>
        </div>
      </div>
    </div>
  );
}
