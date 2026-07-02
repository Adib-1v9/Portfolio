"use client";

// Terminal scripté : un REPL minimal. Il ne connaît pas les commandes (cf. terminalCommands.tsx),
// il lit l'input → cherche dans le registre → affiche la sortie. Anglais (hors i18n).
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { findCommand, type CommandContext } from "./terminalCommands";

const GREEN = "#30D158"; // user@host
const BLUE = "#2E8BFF"; // chemin (~)
const GRAY = "#c9cdd6"; // texte
const USER_KEY = "adibos.terminal.user"; // pseudo persisté (survit au rechargement)

type Line = { id: number; node: ReactNode };

let uid = 0;

// Invite style bash (Ubuntu) : `user@user:~$`. Le pseudo est un état (défaut "user") → une
// future commande le changera sans réécrire le prompt (il se re-rend tout seul).
function Prompt({ user }: { user: string }) {
  return (
    <span className="shrink-0">
      <span style={{ color: GREEN }}>
        {user}@{user}
      </span>
      <span style={{ color: GRAY }}>:</span>
      <span style={{ color: BLUE }}>~</span>
      <span style={{ color: GRAY }}>$&nbsp;</span>
    </span>
  );
}

export function TerminalApp() {
  // Pseudo du prompt : lu depuis le localStorage au montage (le terminal ne se monte qu'au clic,
  // côté client uniquement → pas de mismatch SSR). `rename` le change ET le persiste.
  const [user, setUser] = useState(() =>
    typeof window !== "undefined" ? (localStorage.getItem(USER_KEY) ?? "user") : "user",
  );
  const changeUser = (name: string) => {
    setUser(name);
    try {
      localStorage.setItem(USER_KEY, name);
    } catch {}
  };
  const [lines, setLines] = useState<Line[]>(() => [
    { id: uid++, node: <span style={{ color: GRAY }}>{"Type 'help' to see available commands."}</span> },
  ]);
  const [input, setInput] = useState("");
  const historyRef = useRef<string[]>([]); // saisies non vides, pour le rappel ↑/↓
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const push = (node: ReactNode) => setLines((l) => [...l, { id: uid++, node }]);

  const ctx: CommandContext = {
    clear: () => setLines([]),
    setUser: changeUser,
    history: () => historyRef.current,
  };

  // Auto-scroll : la dernière ligne reste visible à chaque ajout.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  function submit() {
    const raw = input;
    const trimmed = raw.trim();

    // Échoie l'invite + la saisie (comme un vrai terminal).
    push(
      <span>
        <Prompt user={user} />
        <span style={{ color: GRAY }}>{raw}</span>
      </span>,
    );

    if (trimmed) {
      historyRef.current.push(raw);
      const [name, ...args] = trimmed.split(/\s+/);
      const cmd = findCommand(name);
      if (cmd) {
        const out = cmd.run(ctx, args);
        if (out) out.forEach((line) => push(<span style={{ color: GRAY }}>{line}</span>));
      } else {
        push(<span style={{ color: GRAY }}>{name}: command not found</span>);
      }
    }

    setInput("");
    setHistIdx(null);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    const h = historyRef.current;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!h.length) return;
      const idx = histIdx === null ? h.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(h[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const idx = histIdx + 1;
      if (idx >= h.length) {
        setHistIdx(null);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(h[idx]);
      }
    }
  }

  return (
    <div
      className="terminal-scroll h-full w-full overflow-auto p-4 font-mono text-[15px] leading-[1.5]"
      style={{ backgroundColor: "#16181E" }}
      onClick={() => {
        // Clic simple (hors sélection de texte) = refocus l'input.
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) inputRef.current?.focus();
      }}
    >
      {lines.map((l) => (
        <div key={l.id} className="whitespace-pre-wrap break-words">
          {l.node}
        </div>
      ))}
      <div className="flex whitespace-pre-wrap break-words">
        <Prompt user={user} />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label="terminal input"
          className="min-w-0 flex-1 bg-transparent outline-none"
          style={{ color: GRAY, caretColor: GREEN }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
