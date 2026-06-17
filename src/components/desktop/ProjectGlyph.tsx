import { PROJECT_GLYPH_PATHS, type GlyphKey } from "@/lib/projectGlyphs";

export function ProjectGlyph({ name, className }: { name: GlyphKey; className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden focusable="false" className={className}>
      <path d={PROJECT_GLYPH_PATHS[name]} />
    </svg>
  );
}
