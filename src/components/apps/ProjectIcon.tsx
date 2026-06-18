import { ProjectGlyph } from "@/components/desktop/ProjectGlyph";
import type { GlyphKey } from "@/lib/projectGlyphs";

// Icône unique partagée par le bureau, le Finder et les fenêtres. Deux DA selon `fill` :
//   fill=false (défaut) → squircle graphite + glyphe coloré (projets) ;
//   fill=true            → fond plein dans la couleur de l'app + glyphe blanc (apps système).
// `box` = classes de taille du conteneur, `glyph` = taille du picto.
export function ProjectIcon({
  icon,
  color,
  box,
  glyph,
  fill = false,
}: {
  icon: GlyphKey;
  color: string;
  box: string;
  glyph: string;
  fill?: boolean;
}) {
  return (
    <span
      className={`flex flex-none items-center justify-center border border-white/10 ${box} ${
        fill
          ? "shadow-[inset_0_1px_0_rgba(255,255,255,.22)]"
          : "bg-[linear-gradient(160deg,#262932,#1b1d24)] shadow-[inset_0_1px_0_rgba(255,255,255,.10)]"
      }`}
      style={fill ? { background: color, color: "#fff" } : { color }}
    >
      <ProjectGlyph name={icon} className={glyph} />
    </span>
  );
}
