// Registre des commandes du terminal : SOURCE UNIQUE (l'UI ne connaît pas les commandes,
// elle lit ce tableau). Ajouter une commande fun plus tard = une entrée ici ; elle apparaît
// dans `help` automatiquement (sauf `hidden`). Le terminal parle anglais (hors i18n).
import type { ReactNode } from "react";

// Contexte passé à chaque commande : effets sur le terminal + données courantes que l'UI expose.
// Extensible (openWindow, wallpaper…) sans toucher à la signature des commandes existantes.
export type CommandContext = {
  clear: () => void;
  setUser: (name: string) => void; // change le pseudo affiché dans le prompt (commande `rename`)
  history: () => string[]; // saisies précédentes (commande `history`)
};

export type TerminalCommand = {
  name: string;
  summary: string;
  hidden?: boolean; // true = utilisable mais absente de `help` (réservé aux futurs easter eggs)
  run: (ctx: CommandContext, args: string[]) => ReactNode[] | void;
};

export const COMMANDS: TerminalCommand[] = [
  {
    name: "help",
    summary: "show this list of commands",
    run: () => {
      const visible = COMMANDS.filter((c) => !c.hidden);
      const width = Math.max(...visible.map((c) => c.name.length));
      return [
        "Available commands:",
        ...visible.map((c) => `  ${c.name.padEnd(width)}    ${c.summary}`),
      ];
    },
  },
  {
    name: "echo",
    summary: "print text back to the screen",
    run: (_ctx, args) => [args.join(" ")],
  },
  {
    name: "date",
    summary: "show the current date and time",
    run: () => [
      new Date().toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    ],
  },
  {
    name: "history",
    summary: "list the commands you have typed",
    run: (ctx) => ctx.history().map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`),
  },
  {
    name: "rename",
    summary: "change your username",
    run: (ctx, args) => {
      const name = args[0];
      if (!name) return ["usage: rename <name>"];
      ctx.setUser(name);
    },
  },
  {
    name: "clear",
    summary: "clear the terminal",
    run: (ctx) => {
      ctx.clear();
    },
  },
];

export function findCommand(name: string): TerminalCommand | undefined {
  return COMMANDS.find((c) => c.name === name);
}
