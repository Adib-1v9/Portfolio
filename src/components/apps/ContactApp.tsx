"use client";

// Fenêtre Contact : à droite, des cartes cliquables (logos Phosphor) plutôt qu'une capture.
// Chaque carte = une action principale à gauche (ouvrir le lien) + un bouton « copier » à droite.
// GitHub ouvre son profil ; Email ouvre directement le compose Gmail web (pas de mailto: qui
// échoue sans client mail natif configuré). LinkedIn est affiché mais inactif (pas encore de
// compte) ; Discord n'a pas de profil public → seule la copie du pseudo a du sens.
import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ProjectGlyph } from "@/components/desktop/ProjectGlyph";
import type { GlyphKey } from "@/lib/projectGlyphs";
import { findApp } from "@/lib/apps";
import { AppShell } from "./AppShell";

const GITHUB_URL = "https://github.com/Adib-1v9";
const EMAIL = "amrani.adibr@gmail.com";
const DISCORD_PSEUDO = "neyshen";
// Gmail compose web : ouvre un brouillon pré-rempli en destinataire, sans dépendre d'un client
// mail système. Suppose le visiteur connecté à un compte Google (cas majoritaire).
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`;

const CARD =
  "flex items-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.05] px-[12px] py-[11px]";
const MAIN = "flex min-w-0 flex-1 items-center gap-3 rounded-[9px] text-left transition";

function Badge({ glyph, bg, fg }: { glyph: GlyphKey; bg: string; fg: string }) {
  return (
    <span
      className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px]"
      style={{ background: bg, color: fg }}
    >
      <ProjectGlyph name={glyph} className="h-[20px] w-[20px]" />
    </span>
  );
}

function Texts({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[14px] font-semibold text-[#eef1f7]">{label}</div>
      <div className="truncate font-mono text-[11.5px] text-[#8d96a9]">{sub}</div>
    </div>
  );
}

// Petit bouton « copier » (icône) : copie `value` dans le presse-papiers, coche transitoire.
// Désactivé si pas de valeur (ex. LinkedIn pas encore en ligne).
function CopyButton({ value }: { value?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // presse-papiers indisponible (contexte non sécurisé) : on n'affiche pas la coche.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!value}
      title={copied ? t("contact.copied") : t("contact.copy")}
      aria-label={t("contact.copy")}
      className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] border border-white/10 bg-white/[0.04] text-[#8d96a9] transition hover:bg-white/[0.1] hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white/[0.04] disabled:hover:text-[#8d96a9]"
    >
      <ProjectGlyph name={copied ? "check" : "copy"} className="h-[16px] w-[16px]" />
    </button>
  );
}

function ContactPreview() {
  const { t } = useI18n();
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[12px] border border-white/[0.08] p-6 [background:radial-gradient(120%_120%_at_30%_10%,#1b2030,#0d0f15_70%)]">
      <div className="flex w-full max-w-[330px] flex-col gap-[10px]">
        <div className={CARD}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${MAIN} hover:opacity-80`}
          >
            <Badge glyph="github-logo" bg="#ffffff" fg="#111111" />
            <Texts label="GitHub" sub="Adib-1v9" />
          </a>
          <CopyButton value={GITHUB_URL} />
        </div>

        <div className={CARD}>
          <a
            href={GMAIL_COMPOSE}
            target="_blank"
            rel="noopener noreferrer"
            className={`${MAIN} hover:opacity-80`}
          >
            <Badge glyph="envelope" bg="#2E8BFF" fg="#ffffff" />
            <Texts label="Email" sub={EMAIL} />
          </a>
          <CopyButton value={EMAIL} />
        </div>

        <div className={`${CARD} opacity-55`}>
          <div className={MAIN}>
            <Badge glyph="linkedin-logo" bg="#0A66C2" fg="#ffffff" />
            <Texts label="LinkedIn" sub={t("contact.soon")} />
          </div>
          <CopyButton />
        </div>

        <div className={CARD}>
          <div className={MAIN}>
            <Badge glyph="discord-logo" bg="#5865F2" fg="#ffffff" />
            <Texts label="Discord" sub={DISCORD_PSEUDO} />
          </div>
          <CopyButton value={DISCORD_PSEUDO} />
        </div>
      </div>
    </div>
  );
}

export function ContactApp() {
  const { t } = useI18n();
  const app = findApp("contact");
  if (!app?.icon || !app.color) {
    throw new Error('ContactApp : config d\'icône manquante pour "contact" dans apps.ts');
  }
  return (
    <AppShell
      icon={app.icon}
      color={app.color}
      name={t("app.contact")}
      fill
      descKey="contact.intro"
      preview={<ContactPreview />}
    />
  );
}
