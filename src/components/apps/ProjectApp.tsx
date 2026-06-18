"use client";

// Intérieur de la fenêtre d'un projet (ouverte au double-clic d'une icône bureau ou via
// « Voir plus » dans le Finder). Délègue tout le layout à AppShell (design A partagé) ; on ne
// fournit que les données du projet. La méta = catégorie, colorée avec l'accent du projet.
import { useI18n } from "@/components/i18n/LanguageProvider";
import { CATEGORY_LABEL, type Project } from "@/lib/projects";
import { AppShell } from "./AppShell";

export function ProjectApp({ project }: { project: Project }) {
  const { t } = useI18n();
  return (
    <AppShell
      icon={project.icon}
      color={project.color}
      name={project.name}
      meta={t(CATEGORY_LABEL[project.category])}
      metaColor={project.color}
      descKey={project.descKey}
      techKey={project.techKey}
      tech
      shots={project.shots}
    />
  );
}
